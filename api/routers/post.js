'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { mustAuthenticated, OperationResults, bindDataToRes, checkAccess } = require('../utils');
const { Category, Post, Attachment } = require('db');


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
        .then(data => OperationResults.Success(data.map(i => i.date)))
        .catch(OperationResults.Error)
        .then(res.send.bind(res));
});

router.get(
    '/getById',
    mustAuthenticated,
    checkAccess(Post, req => req.query.id),
    (req, res) => bindDataToRes(res,
        Post.findByPk(req.query.id, {
            include: [
                {
                    model: Category,
                    as: 'categories'
                },
                {
                    model: Attachment,
                    as: 'attachments'
                }
            ]
        })
    )
);

router.post(
    '/save',
    mustAuthenticated,
    checkAccess(Post, req => req.body.id),
    async (req, res) => {
        try {
            const [post] = await Post.upsert({// values
                id: req.body.id || null,
                title: req.body.title,
                body: req.body.body,
                date: req.body.date,
                ownerId: req.session.user.id
            })
            await post.setCategories(req.body.categories);
            res.send(OperationResults.Success(post.id));

        } catch (e) {
            res.send(OperationResults.Error(e));
        }
    }
);

router.post(
    '/deleteById',
    mustAuthenticated,
    checkAccess(Post, req => req.body.id),
    (req, res) => bindDataToRes(res,
        Post.build({ id: req.body.id }).destroy()
    )
);




module.exports = router;