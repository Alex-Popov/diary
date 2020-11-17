'use strict';

const sequelize = require('../sequelize');
const DataTypes = require('../DataTypes');
const { Model } = require('sequelize');

const { ROLE_ADMIN, ROLE_USER } = require('roles');
const bcrypt = require('bcrypt');


class User extends Model {
    static findByUsername(username) {
        return this.findOne({
            where: {
                username
            }
        });
    }
    static async findByUsernameAndPassword(username, password) {
        let user = await this.findByUsername(username);

        // invalid username
        if (!user) throw new Error('Invalid username');

        // validate password
        if (!bcrypt.compareSync(password, user.password)) throw new Error('Invalid password');

        return user;
    }
    static async setPassword(username, oldPassword, newPassword) {
        let user = await this.findByUsername(username);

        // invalid username
        if (!user) throw new Error('Invalid username');

        // validate password
        if (user.password && !bcrypt.compareSync(oldPassword, user.password)) throw new Error('Invalid password');

        // set fields and save
        user.password = newPassword;
        return user.save();
    }
}


User.init({
    username: {
        type: DataTypes.STRING(32),
        allowNull: false,
        unique: true,
        set(value) {
            this.setDataValue('username', value);
            this.setDataValue('changedDate', new Date());
            //this.setDataValue('changedBy', 1);
        }
    },
    password: {
        type: DataTypes.STRING,
        set(value) {
            this.setDataValue('password', bcrypt.hashSync(value, 10) );

            this.setDataValue('changedDate', new Date());
            this.setDataValue('changedPasswordDate', new Date());
            //this.setDataValue('changedBy', 1);
        }
    },
    /*roleEnum: {
        type: DataTypes.ENUM([ROLE_ADMIN, ROLE_USER])
    },*/
    role: {
        type: DataTypes.STRING,
        validate: {
            isIn: [[ROLE_ADMIN, ROLE_USER]]
        }
    },
    changedDate: {
        type: DataTypes.DATE_NO_TZ,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    changedPasswordDate: {
        type: DataTypes.DATE_NO_TZ
    }/*,
    changedBy: {
        type: DataTypes.INTEGER,
        references: {
            model: 'User',
            key: 'id',
            deferrable: Deferrable.NOT
        }
    }*/
}, {
    sequelize,
    modelName: 'User',
    timestamps: false
});

module.exports = User;