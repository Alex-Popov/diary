'use strict';

require('dotenv').config();

module.exports = {
    IS_PROD: !!(process.env.NODE_ENV && process.env.NODE_ENV === 'prod'),
    PORT: (process.env.PORT || 3000),
    DB_TYPE: 'postgres',
    DB_HOST: process.env.DBHOST,
    DB_PORT: process.env.DBPORT,
    DB_USERNAME: process.env.DBUSERNAME,
    DB_NAME: process.env.DBNAME,
    DB_PASSWORD: process.env.DBPASSWORD,
    COOKIE_SECRET: 'dhaajkah3lky85o%j3k"^(D',
    SESSION_AGE: 1000 * 60 * 60 * 2
}