'use strict';

const sequelize = require('../sequelize');
const DataTypes = require('../DataTypes');
const { Model } = require('sequelize');
const fs = require('fs');
const path = require('path');
const config = require('config');


class Attachment extends Model {
/*    static findByUsername(username) {
        return this.findOne({
            where: {
                username
            }
        });
    }*/
}


Attachment.init({
    fileName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    relativeFilePath: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    mimeType: {
        type: DataTypes.STRING(100),
        allowNull: false
    },
    size: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Attachment',
//    timestamps: false,

    hooks: {
        beforeDestroy: async ({ id, relativeFilePath }) => {
            if (!relativeFilePath) {
                const attachment = await Attachment.findByPk(id);
                relativeFilePath = attachment.relativeFilePath;
            }
            fs.rmSync(path.join(config.PATH_ATTACHMENTS, relativeFilePath), {force: true});
        }
    }
});

module.exports = Attachment;