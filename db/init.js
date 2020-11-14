const logger = require('logger');

const { sequelize, DataTypes } = require('db');
const { User, ROLE_ADMIN, ROLE_USER } = require('../entities/user');
const Category = require('../entities/category');
const Post = require('../entities/post');

const initTables = async () => {

    try {
        await sequelize.sync({force: true});

        // users
        await User.create({
            username: 'admin',
            password: 'admin',
            role: ROLE_ADMIN
        });
        await User.create({
            username: 'user1',
            password: '111',
            role: ROLE_USER
        });
        // categories
        let Eat = await Category.create({name: 'Еда', color: '#00ab00'});
        let Hobby = await Category.create({name: 'Хобби', color: '#8f4f0e'});
        let Sex = await Category.create({name: 'Секс', color: '#ec4949'});

        await Eat.createPost({title: 'Торт с начинкой их слез твоих врагов', date:'2020-05-12'});
        await Eat.createPost({title: 'Хот Дог из кошки', body: 'Жуй!', date:'2020-04-21'});
        await Hobby.createPost({title: 'Милый бычок крючком с глазами', date:'2020-07-18'});
        await Sex.createPost({title: 'Оргазм как у 18летней', date:'2020-07-12'});
        await Hobby.createPost({title: 'Вязание с закрытыми глазами. Практика', date:'2020-10-01'});
        await Hobby.createPost({title: 'Примеры работ', date:'2020-05-12'});

        //console.log(await Eat.getPost());
        //console.log(Post.build({id:1}).getCategory);

        //await Sex.addChildCategory([Eat]);

        logger.info('All models were synchronized successfully.');

    } catch (e) {
        logger.error(e);
    }

}

module.exports = initTables;