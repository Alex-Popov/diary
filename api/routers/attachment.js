'use strict';

const fs = require('fs');
const path = require('path');
const config = require('config');
const express = require('express');
const { OperationResults, mustAuthenticated, checkAccess, bindDataToRes } = require('../utils');
const { Attachment, mapEntitiesByKeys } = require('db');
const { nanoid } = require('nanoid/non-secure');
const httpError = require('http-errors');
const { ACCEPTED_FILES } = require('const');


/*
name: '2417.jpg',
size: 2417154,
tempFilePath: 'D:\\Diary\\dev\\tmp\\tmp-2-1606041396628',
mimetype: 'image/jpeg'
*/


const router = express.Router();


router.get(
    '/getAllByParent',
    mustAuthenticated,
    checkAccess(
        req => mapEntitiesByKeys[req.query.parentEntity],
        req => req.query.parentId
    ),
    (req, res, next) => {
        const { parentEntity, parentId } = req.query;

        // invalid request data
        if (!parentEntity || !parentId) return next(httpError(400));

        bindDataToRes(res,
            mapEntitiesByKeys[parentEntity].build({id: parentId}).getAttachments({
                order: [
                    ['createdAt', 'DESC']
                ]
            })
        )
    }
);

router.post(
    '/uploadFile',
    mustAuthenticated,
    checkAccess(
        req => mapEntitiesByKeys[req.body.parentEntity],
        req => req.body.parentId
    ),
    async (req, res, next) => {
        // no files
        if (!req.files || !req.files.file)  return next(httpError(400, 'No files were uploaded'));

        const file = req.files.file;

        // invalid request data
        //if (!parentEntity || !parentId || !file) return next(httpError(400)); - checkAccess will check if parent record exist

        // invalid mime type
        if (!ACCEPTED_FILES.includes(file.mimetype)) return next(httpError(400, 'Unsupported file type'));

        // path
        const relativeFilePath = `${Date.now()}_${nanoid()}`;
        const filePath = path.join(config.PATH_ATTACHMENTS, relativeFilePath);

        try {
            // move file
            await file.mv(filePath);

            // create attachment for parent entity
            const ParentEntity = mapEntitiesByKeys[req.body.parentEntity];
            const attachment = await ParentEntity.build({id: req.body.parentId}).createAttachment({
                fileName: file.name,
                relativeFilePath,
                mimeType: file.mimetype,
                size: file.size,
                ownerId: req.session.user.id
            });

            // response
            //setTimeout(() => {
                res.send(OperationResults.Success(attachment.id));
            //}, (file.size / 1000 * 1.5 * 3));

        } catch (e) {
            fs.rmSync(file.tempFilePath, {force: true});
            fs.rmSync(filePath, {force: true});

            res.send(OperationResults.Error(e));
        }
    }
);

router.post('/uploadChunk', mustAuthenticated, (req, res, next) => {
    console.log('=== HANDLE API ===');
});

router.post(
    '/deleteById',
    mustAuthenticated,
    checkAccess(Attachment, req => req.body.id),
    (req, res) => bindDataToRes(res,
        Attachment.build({ id: req.body.id }).destroy()
    )
);


module.exports = router;