'use strict';

const express = require('express');
const httpError = require('http-errors');


// Router for all /api/ requests

const router = express.Router();

router.use('/auth', require('./routers/auth'));
router.use('/user', require('./routers/user'));
router.use('/category', require('./routers/category'));
router.use('/post', require('./routers/post'));
router.use('/attachment', require('./routers/attachment'));


// api/* - 404

router.use((req, res, next) => {
    next(httpError(404));
});



module.exports = router;