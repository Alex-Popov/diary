'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { mustAuthenticated, bindDataToRes, checkOwnerMiddlewareFactory } = require('../utils');
const { Category } = require('db/schema');

// permission checkers
const checkOwnerPost = checkOwnerMiddlewareFactory(Category, req => req.body.id);
const checkOwnerGet = checkOwnerMiddlewareFactory(Category, req => req.query.id);


const router = express.Router();


router.get('/getAll', mustAuthenticated, (req, res) => bindDataToRes(res,
    Category.findAll({
        where: {
            ownerId: {
                [Op.eq]: req.session.user.id
            }
        }
    })
));

router.get('/getById', mustAuthenticated, checkOwnerGet, (req, res) => bindDataToRes(res,
    Category.findByPk(req.query.id)
));

/*router.get('/getAllByParentId', mustAuthenticated, (req, res) => bindDataToRes(res,
    Category.build({ id: req.query.id }).getChildCategory()
));*/

router.post('/save', mustAuthenticated, checkOwnerPost, (req, res) => bindDataToRes(res,
    Category.upsert({// values
        id: req.body.id || null,
        parentId: req.body.parentId || null,
        name: req.body.name,
        color: req.body.color,
        ownerId: req.session.user.id
    })
));

router.post('/deleteById', mustAuthenticated, checkOwnerPost, (req, res) => bindDataToRes(res,
    Category.build({ id: req.body.id }).destroy()
));



module.exports = router;