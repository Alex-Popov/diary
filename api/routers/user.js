'use strict';

const express = require('express');
const { mustAuthenticated, bindDataToRes, isAdmin } = require('../utils');
const { User } = require('db');



const router = express.Router();


router.get('/getAll', isAdmin, (req, res) => bindDataToRes(res,
    User.findAll()
));

router.get('/getById', isAdmin, (req, res) => bindDataToRes(res,
    User.findByPk(req.query.id)
));

router.get('/getCurrent', mustAuthenticated, (req, res) => bindDataToRes(res,
    User.findByPk(req.session.user.id)
));

router.post('/deleteById', isAdmin, (req, res) => bindDataToRes(res,
    User.build({ id: req.body.id }).destroy()
));


module.exports = router;