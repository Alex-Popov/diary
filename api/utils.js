'use strict';

const { authorize } = require('auth');
const { ROLE_ADMIN } = require('const');
const httpError = require('http-errors');
const { isClass } = require('utils');
const { Model } = require('sequelize');


/*
 * OperationResults class
 *
 * returns for every non-http-errors responses
 * server side mirror for client fetch() wrapper: /client/core/query.js
 */
class OperationResults {
    isSuccessful = false;
    messages = [];
    data;

    constructor(isSuccessful, messages, data) {
        this.isSuccessful = !!isSuccessful;
        this.messages = this.messages.concat(messages);
        this.data = data;
    }

    static Error(error) {
        if (error instanceof Error)
            return new OperationResults(false, error.message);

        if (typeof error === 'string')
            return new OperationResults(false, error);

        return new OperationResults(false);
    }

    static Success(data, message) {
        return new OperationResults(true, message, data);
    }
}

//
// constant format for session data in response
// filter secure session data
//
const clientSessionWrapper = (session) => ({
    sessionId: session.id,
    userId: session.user.id,
    userRole: session.user.role
});


//
// middleware helpers
//
const mustAuthenticated = authorize();

const isAdmin = authorize(ROLE_ADMIN);

const checkAccess = (getEntity, getId) => { // middleware factory
    return async (req, res, next) => {
        // get id from Request
        const id = (typeof getId === 'function' ? getId(req) : getId);
        const Entity = (typeof getEntity === 'function' && !isClass(getEntity) ? getEntity(req) : getEntity);

        // check access if ID and Model are exist
        if (id) {
            if (!(Entity.prototype instanceof Model)) return next(httpError(400));

            try {
                // try to get a row by Entity and id
                const instance = await Entity.findByPk(id, {
                    attributes: ['ownerId']
                });

                // no record at all
                if (!instance) return next(httpError(400, 'No record exists'));

                // owner doesn't match - 403
                if (instance.ownerId !== req.session.user.id) return next(httpError(403));

            } catch (e) {
                // if error on query - 400
                return next(httpError(400, e.message));
            }
        }

        next();
    }
}


//
// promise helpers
//

const bindDataToRes = (res, dataProviderPromise) => {
    dataProviderPromise
        .then(OperationResults.Success, OperationResults.Error)
        .then(res.send.bind(res));
}



module.exports = {
    OperationResults,
    mustAuthenticated,
    isAdmin,
    clientSessionWrapper,
    bindDataToRes,
    checkAccess
};