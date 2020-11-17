const { sequelize, DataTypes } = require('db');
const { Model } = require('sequelize');
const Category = require('./category');


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