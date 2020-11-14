'use strict';

const config = require('config');
const logger = require('logger');
const { Sequelize, DataTypes: SequelizeDataTypes } = require('sequelize');
const withDateNoTz = require('sequelize-date-no-tz-postgres');
const withTimeNoTz = require('sequelize-time-no-tz-postgres');

//
// create instance
//
const sequelize = new Sequelize({
    dialect: config.DB_TYPE,
    host: config.DB_HOST,
    port: config.DB_PORT,
    database: config.DB_NAME,
    username: config.DB_USERNAME,
    password: config.DB_PASSWORD,

//    ssl: !!config.IS_PROD,
    logging: false,

    define: {
        freezeTableName: true
    }
});

//
// data types
//
const DataTypes = withTimeNoTz(withDateNoTz(SequelizeDataTypes));


module.exports = {
    sequelize,
    DataTypes
};