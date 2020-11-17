'use strict';

const sequelize = require('../sequelize');
const DataTypes = require('../DataTypes');
const { Model } = require('sequelize');


//
// Methods
//
class Category extends Model {
}


//
// Fields
//
Category.init({
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true
    },
    color: {
        type: DataTypes.STRING(7),
/*        allowNull: false,
        unique: true*/
    }
}, {
    sequelize,
    modelName: 'Category',
    timestamps: false
});



module.exports = Category;