'use strict';

const express = require('express');
const httpError = require('http-errors');

const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const categoryRouter = require('./routers/category');
const postRouter = require('./routers/post');


// Router for all /api/ requests

const router = express.Router();

router.use('/auth', authRouter);
router.use('/user', userRouter);
router.use('/category', categoryRouter);
router.use('/post', postRouter);


// api/* - 404

router.use((req, res, next) => {
    next(httpError(404));
});



module.exports = router;