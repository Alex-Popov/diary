'use strict';

const sequelize = require('../sequelize');
const DataTypes = require('../DataTypes');
const { Model } = require('sequelize');



//
// Methods
//
class Post extends Model {
}


//
// Fields
//
Post.init({
    title: {
        type: DataTypes.STRING(512)
    },
    body: {
        type: DataTypes.TEXT
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: 'Post',
    timestamps: false
});



module.exports = Post;