'use strict';

const logger = require('logger');
const sequelize = require('./sequelize');
const DataTypes = require('./DataTypes');

const sync = async () => {
    try {
        require('./schema');
        await sequelize.sync();
        logger.info('All models were synchronized successfully.');

    } catch (e) {
        logger.error(e);
    }
}


module.exports = {
    sequelize,
    DataTypes,
    sync
};