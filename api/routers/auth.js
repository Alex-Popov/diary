'use strict';

const express = require('express');
const { OperationResults, mustAuthenticated, clientSessionWrapper, bindDataToRes } = require('../utils');
const { authenticate, logout } = require('auth');
const { User } = require('db/schema');



const router = express.Router();


router.get('/autoLogin', mustAuthenticated, (req, res) => res.send(
    new OperationResults(true, '', clientSessionWrapper(req.session))
));

router.post('/login', (req, res) => bindDataToRes(res,
    User.findByUsernameAndPassword(req.body.username, req.body.password)
        .then(async user => {
            await authenticate(req.session, user);
            return clientSessionWrapper(req.session);
        })
));

router.all('/logout', (req, res) => bindDataToRes(res,
    logout(req.session)
));

router.post('/changePassword', mustAuthenticated, (req, res) => bindDataToRes(res,
    User.setPassword(req.session.user.username, req.body.oldPassword, req.body.newPassword)
));


module.exports = router;