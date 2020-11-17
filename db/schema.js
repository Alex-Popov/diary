'use strict';

const User = require('./entities/user');
const Category = require('./entities/category');
const Post = require('./entities/post');


//
// Relations
//


// Category -> Category | one-to-many

Category.hasMany(Category, {
    as: 'childCategories',
    foreignKey: 'parentId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
    useJunctionTable: false
});
/*
.getChildCategories()
.countChildCategories()
.hasChildCategories()
.hasChildCategories([])
.setChildCategories()
.addChildCategories()
.addChildCategories([])
.removeChildCategories()
.removeChildCategories([])
.createChildCategories()
*/

Category.belongsTo(Category, {
    as: 'parentCategory',
    foreignKey: 'parentId'
});
/*
.getParentCategory()
.setParentCategory()
.createParentCategory()
*/



// Category <-> Post | many-to-many

Category.belongsToMany(Post, {
    through: 'PostToCategory',
    as: 'posts'
});
/*
.getPosts()
.countPosts()
.hasPosts()
.hasPosts([])
.setPosts()
.addPosts()
.addPosts([])
.removePosts()
.removePosts([])
.createPosts()
*/

Post.belongsToMany(Category, {
    through: 'PostToCategory',
    as: 'categories'
});
/*
.getCategories()
.countCategories()
.hasCategories()
.hasCategories([])
.setCategories()
.addCategories()
.addCategories([])
.removeCategories()
.removeCategories([])
.createCategories()
*/



// User -> Category | one-to-many

User.hasMany(Category, {
    as: 'categories',
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    useJunctionTable: false
});
/*
.getCategories()
.countCategories()
.hasCategories()
.hasCategories([])
.setCategories()
.addCategories()
.addCategories([])
.removeCategories()
.removeCategories([])
.createCategories()
*/

Category.belongsTo(User, {
    as: 'owner',
    foreignKey: 'ownerId'
});
/*
.getOwner()
.setOwner()
.createOwner()
*/



// User -> Post | one-to-many

User.hasMany(Post, {
    as: 'posts',
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    useJunctionTable: false
});
/*
.getPosts()
.countPosts()
.hasPosts()
.hasPosts([])
.setPosts()
.addPosts()
.addPosts([])
.removePosts()
.removePosts([])
.createPosts()
*/

Post.belongsTo(User, {
    as: 'owner',
    foreignKey: 'ownerId'
});
/*
.getOwner()
.setOwner()
.createOwner()
*/





module.exports = {
    User,
    Category,
    Post
};