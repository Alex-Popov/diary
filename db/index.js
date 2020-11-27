'use strict';

const { ENTITY_POST, ENTITY_CATEGORY, ENTITY_USER, ENTITY_ATTACHMENT } = require('const');

const sequelize = require('./sequelize');
const DataTypes = require('./DataTypes');

const { User, Category, Post, Attachment } = require('./schema');

const mapEntitiesByKeys = {
    [ENTITY_POST]: Post,
    [ENTITY_CATEGORY]: Category,
    [ENTITY_USER]: User,
    [ENTITY_ATTACHMENT]: Attachment
}

module.exports = {
    sequelize,
    DataTypes,

    mapEntitiesByKeys,

    User,
    Category,
    Post,
    Attachment
};