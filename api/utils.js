'use strict';

const { authorizeMiddlewareFactory } = require('auth');
const { ROLE_ADMIN } = require('db/entities/user');
const httpError = require('http-errors');


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
const mustAuthenticated = authorizeMiddlewareFactory();

const isAdmin = authorizeMiddlewareFactory(ROLE_ADMIN);

const checkOwnerMiddlewareFactory = (entity, getId) => {
    return async (req, res, next) => {
        // get id from Request
        const id = getId(req);

        // check access if ID exist
        if (id) {
            try {
                // try to get a row by entity and id
                const row = await entity.findOne({
                    where: {
                        id,
                        ownerId: req.session.user.id
                    }
                });
                // if no row - 403
                if (!row) return next(httpError(403));

            } catch (e) {
                // if error on query - 403
                return next(httpError(403, e.message));
            }
        }

        next();
    }
}


//
// response helpers
//

const promiseHandler = (isSuccessful, messages, data) => {
    // only first argument provided - Promise case
    if (messages === undefined && data === undefined) {
        // error, no messages, error = isSuccessful - .catch() case
        if (isSuccessful instanceof Error) {
            return new OperationResults(false, isSuccessful.message);

            // success, no messages, data = isSuccessful - .then() case
        } else {
            return new OperationResults(true, '', isSuccessful);
        }

        // All arguments provided, manual creation case
    } else {
        return new OperationResults(isSuccessful, messages, data);
    }
}

const bindDataToRes = (res, dataProviderPromise) => {
    dataProviderPromise
        .then(promiseHandler, promiseHandler)
        .then(res.send.bind(res));
}



module.exports = {
    OperationResults,
    mustAuthenticated,
    isAdmin,
    clientSessionWrapper,
    promiseHandler,
    bindDataToRes,
    checkOwnerMiddlewareFactory
};