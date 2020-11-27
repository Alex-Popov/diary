'use strict';

const User = require('./entities/user');
const Category = require('./entities/category');
const Post = require('./entities/post');
const Attachment = require('./entities/attachment');


//
// Relations
//


// Category -> Category | one-to-many

Category.hasMany(Category, {
    as: 'childCategories',
    foreignKey: 'parentId',
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE'
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



// Post -> Attachment | one-to-many

Post.hasMany(Attachment, {
    foreignKey: 'postId',
    as: 'attachments',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    hooks: true
});
/*
.getAttachments()
.countAttachments()
.hasAttachments()
.hasAttachments([])
.setAttachments()
.addAttachments()
.addAttachments([])
.removeAttachments()
.removeAttachments([])
.createAttachment()
*/

Attachment.belongsTo(Post, {
    foreignKey: 'postId'
});





//
// Owner
//

// User -> Category | one-to-many

User.hasMany(Category, {
    as: 'categories',
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Category.belongsTo(User, {
    as: 'owner',
    foreignKey: 'ownerId'
});


// User -> Post | one-to-many

User.hasMany(Post, {
    as: 'posts',
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Post.belongsTo(User, {
    as: 'owner',
    foreignKey: 'ownerId'
});


// User -> Attachment | one-to-many

User.hasMany(Attachment, {
    as: 'attachments',
    foreignKey: {
        name: 'ownerId',
        allowNull: false
    },
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

Attachment.belongsTo(User, {
    as: 'owner',
    foreignKey: 'ownerId'
});





module.exports = {
    User,
    Category,
    Post,
    Attachment
};