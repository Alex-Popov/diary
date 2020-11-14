'use strict';

const express = require('express');
const httpError = require('http-errors');
const { Op } = require("sequelize");

const OperationResults = require('./operation-results');
const { authenticate, logout, authorizeMiddlewareFactory } = require('auth');

const { User, ROLE_ADMIN, ROLE_USER } = require('../entities/user');
const Category = require('../entities/category');
const Post = require('../entities/post');


//
// permission checkers
//
const mustAuthenticated = authorizeMiddlewareFactory(),
      isAdmin = authorizeMiddlewareFactory(ROLE_ADMIN);


//
// helpers
//
const clientSessionWrapper = (session) => ({
    sessionId: session.id,
    userId: session.user.id,
    userRole: session.user.role
});

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


//
// init Router for all /api/ requests
//
const router = express.Router();


// auth/

router.get('/auth/autoLogin', mustAuthenticated, (req, res) => res.send(
    new OperationResults(true, '', clientSessionWrapper(req.session))
));
router.post('/auth/login', (req, res) => bindDataToRes(res,
    User.findByUsernameAndPassword(req.body.username, req.body.password)
        .then(async user => {
            await authenticate(req.session, user);
            return clientSessionWrapper(req.session);
        })
));
router.all('/auth/logout', (req, res) => bindDataToRes(res,
    logout(req.session)
));
router.post('/auth/changePassword', mustAuthenticated, (req, res) => bindDataToRes(res,
    User.setPassword(req.session.user.username, req.body.oldPassword, req.body.newPassword)
));



// user/

router.get('/user/getAll', isAdmin, (req, res) => bindDataToRes(res,
    User.findAll()
));
router.get('/user/getById', isAdmin, (req, res) => bindDataToRes(res,
    User.findByPk(req.query.id)
));
router.get('/user/getCurrent', mustAuthenticated, (req, res) => bindDataToRes(res,
    User.findByPk(req.session.user.id)
));
router.post('/user/deleteById', isAdmin, (req, res) => bindDataToRes(res,
    Category.destroy({
        where: {
            id: req.body.id
        }
    })
));



// category/

router.get('/category/getAll', mustAuthenticated, (req, res) => bindDataToRes(res,
    Category.findAll()
));
router.get('/category/getById', mustAuthenticated, (req, res) => bindDataToRes(res,
    Category.findByPk(req.query.id)
));
router.get('/category/getAllByParentId', mustAuthenticated, (req, res) => bindDataToRes(res,
    Category.build({ id: req.query.id }).getChildCategory()
));
router.post('/category/save', mustAuthenticated, (req, res) => bindDataToRes(res,
    Category.upsert({// values
        id: req.body.id || null,
        parentId: req.body.parentId || null,
        name: req.body.name,
        color: req.body.color
    })
));
router.post('/category/deleteById', mustAuthenticated, (req, res) => bindDataToRes(res,
    Category.build({ id: req.body.id }).destroy()
));



// post/

router.get('/post/getAll', mustAuthenticated, (req, res) => bindDataToRes(res,
    Post.findAll()
));
router.get('/post/getById', mustAuthenticated, (req, res) => bindDataToRes(res,
    Post.findByPk(req.query.id, {
        include: {
            model: Category,
            as: 'categories'
        }
    })
));
router.post('/post/save', mustAuthenticated, async (req, res) => {
    try {
        const [post] = await Post.upsert({// values
            id: req.body.id || null,
            title: req.body.title,
            body: req.body.body,
            date: req.body.date
        })
        await post.setCategories(req.body.categories);
        res.send(new OperationResults(true, '', post.id));

    } catch (e) {
        res.send(promiseHandler(e));
    }
});
router.post('/post/deleteById', mustAuthenticated, (req, res) => bindDataToRes(res,
    Post.build({ id: req.body.id }).destroy()
));


router.get('/post/getAllByFilter', mustAuthenticated, (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    let categoryWhere = {},
        postWhere = {};

    // categories
    if (filter.categories && Array.isArray(filter.categories) && filter.categories.length)
        categoryWhere.id = {
            [Op.in]: filter.categories
        }

    // startDate only
    if (filter.startDate && !filter.endDate)
        postWhere.date = {
            [Op.eq]: filter.startDate
        }

    // startDate + endDate
    if (filter.startDate && filter.endDate)
        postWhere.date = {
            [Op.between]: [filter.startDate, filter.endDate]
        }

    // search
    if (filter.searchTerm)
        postWhere[Op.or] = [
            {
                title: {
                    [Op.substring]: filter.searchTerm
                }
            },
            {
                body: {
                    [Op.substring]: filter.searchTerm
                }
            }
        ];

    bindDataToRes(res,
        Post.findAll({
            where: postWhere,
            include: {
                model: Category,
                as: 'categories',
                where: categoryWhere,
                required: !!filter.categories.length
            },
            order: [
                ['date', 'ASC']
            ]
        })
    )
});

router.get('/post/getAllDates', mustAuthenticated, (req, res) => {
    Post.findAll({
        attributes: ['date'],
        group: 'date'
    })
        .then(data => res.send(
            new OperationResults(true, '', data.map(i => i.date))
        ))
        .catch(promiseHandler)
});





// api/* - 404

router.use((req, res, next) => {
    next(httpError(404));
});



module.exports = router;