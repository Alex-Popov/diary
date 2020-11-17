'use strict';

const config = require('config');
const { Sequelize } = require('sequelize');

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


module.exports = sequelize;