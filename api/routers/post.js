'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { mustAuthenticated, OperationResults, bindDataToRes, checkAccess } = require('../utils');
const { Category, Post, Attachment } = require('db');
const { PAGE_SIZE } = require('const');
const { PATH_TEMPLATES } = require('config');
const fs = require('fs');
const path = require('path');


const pdf = require('html-pdf');
const pdfOptions = {
    format: 'A4',
    orientation: 'portrait'
};
const template = fs.readFileSync(require.resolve(path.join(PATH_TEMPLATES, 'post.html')), 'utf8');


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

router.get('/getAllByFilter', mustAuthenticated, async (req, res) => {
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

/*    bindDataToRes(res,
        Post.findAll({
            where: postWhere,
            include: {
                model: Category,
                as: 'categories',
                where: categoryWhere,
                required: !!filter.categories.length
            },
            order: [
                ['date', 'DESC']
            ]
        })
    )*/

    try {
        const posts = await Post.findAll({
            where: postWhere,
            include: {
                model: Category,
                as: 'categories',
                where: categoryWhere,
                required: !!filter.categories.length
            },
            order: [
                ['date', 'DESC']
            ],
            offset: (filter.page - 1) * PAGE_SIZE,
            limit: PAGE_SIZE
        });
        const total = await Post.count({
            where: postWhere,
            include: {
                model: Category,
                as: 'categories',
                attributes: [],
                where: categoryWhere,
                required: !!filter.categories.length
            },
            group: ['Post.id']
        });

        res.send(OperationResults.Success({
            posts,
            total: total.length
        }));

    } catch (e) {
        res.send(OperationResults.Error(e));
    }
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

router.get(
    '/getPDFById',
    mustAuthenticated,
    checkAccess(Post, req => req.query.id),
    async (req, res) => {
        const p = await Post.findByPk(req.query.id);

        let html = template;
        html = html.replace('{{title}}', p.title);
        html = html.replace('{{date}}', p.date);
        html = html.replace('{{body}}', p.body || '');

        pdf.create(html, pdfOptions).toStream((e, stream) => {
            if (e) return res.send(OperationResults.Error(e));

            res.setHeader('Content-Type', 'application/pdf');
            stream.pipe(res);
        })
    }

);



module.exports = router;