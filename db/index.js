'use strict';

const sequelize = require('./sequelize');
const DataTypes = require('./DataTypes');

const { User, Category, Post } = require('./schema');



module.exports = {
    sequelize,
    DataTypes,

    User,
    Category,
    Post
};