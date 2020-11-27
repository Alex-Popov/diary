'use strict';

const express = require('express');
const { Op } = require('sequelize');
const { OperationResults, mustAuthenticated, bindDataToRes, checkAccess } = require('../utils');
const { Category } = require('db');


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

router.get(
    '/getById',
    mustAuthenticated,
    checkAccess(Category, req => req.query.id),
    (req, res) => bindDataToRes(res,
        Category.findByPk(req.query.id)
    )
);

router.post(
    '/save',
    mustAuthenticated,
    checkAccess(Category, req => req.body.id),
    (req, res) => bindDataToRes(res,
        Category.upsert({// values
            id: req.body.id || null,
            parentId: req.body.parentId || null,
            name: req.body.name,
            color: req.body.color,
            ownerId: req.session.user.id
        })
    )
);

router.post(
    '/deleteById',
    mustAuthenticated,
    checkAccess(Category, req => req.body.id),
    (req, res) => bindDataToRes(res,
        Category.build({ id: req.body.id }).destroy()
    )
);



module.exports = router;