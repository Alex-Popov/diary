'use strict';

const { DataTypes: SequelizeDataTypes } = require('sequelize');
const withDateNoTz = require('sequelize-date-no-tz-postgres');
const withTimeNoTz = require('sequelize-time-no-tz-postgres');

const DataTypes = withTimeNoTz(withDateNoTz(SequelizeDataTypes));


module.exports = DataTypes;