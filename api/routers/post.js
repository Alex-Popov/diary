'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { OperationResults, mustAuthenticated, promiseHandler, bindDataToRes, checkOwnerMiddlewareFactory } = require('../utils');
const { Category, Post } = require('db/schema');

// permission checkers
const checkOwnerPost = checkOwnerMiddlewareFactory(Post, req => req.body.id);
const checkOwnerGet = checkOwnerMiddlewareFactory(Post, req => req.query.id);


const router = express.Router();


router.get('/getAll', mustAuthenticated, (req, res) => bindDataToRes(res,
    Post.findAll({
        where: {
            ownerId: {
                [Op.eq]: req.session.user.id
            }
        }
    })
));

router.get('/getAllByFilter', mustAuthenticated, (req, res) => {
    const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
    let categoryWhere = {},
        postWhere = {
            ownerId: {
                [Op.eq]: req.session.user.id
            }
        };

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

router.get('/getAllDates', mustAuthenticated, (req, res) => {
    Post.findAll({
        where: {
            ownerId: {
                [Op.eq]: req.session.user.id
            }
        },
        attributes: ['date'],
        group: 'date'
    })
        .then(data => res.send(
            new OperationResults(true, '', data.map(i => i.date))
        ))
        .catch(promiseHandler)
});

router.get('/getById', mustAuthenticated, checkOwnerGet, (req, res) => bindDataToRes(res,
    Post.findByPk(req.query.id, {
        include: {
            model: Category,
            as: 'categories'
        }
    })
));

router.post('/save', mustAuthenticated, checkOwnerPost, async (req, res) => {
    try {
        const [post] = await Post.upsert({// values
            id: req.body.id || null,
            title: req.body.title,
            body: req.body.body,
            date: req.body.date,
            ownerId: req.session.user.id
        })
        await post.setCategories(req.body.categories);
        res.send(new OperationResults(true, '', post.id));

    } catch (e) {
        res.send(promiseHandler(e));
    }
});

router.post('/deleteById', mustAuthenticated, checkOwnerPost, (req, res) => bindDataToRes(res,
    Post.build({ id: req.body.id }).destroy()
));




module.exports = router;