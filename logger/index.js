'use strict';

const config = require('config');
const path = require('path');
const fs = require('fs');
const bunyan = require('bunyan');
const bunyanDebugStream = require('bunyan-debug-stream');
const specificLevelStream = require('./specific-level-stream');

//
// process settings
//
let settings = {};

if (config.IS_PROD) {
    settings = {
        name: 'dnd-tool-prod',
        streams: [
            specificLevelStream({
                level: [bunyan.INFO, bunyan.WARN],
                stream: fs.createWriteStream(path.join(__dirname, '../logs/log-info.log'), {
                    flags: 'a',
                    encoding: 'utf8'
                })
            }),
            specificLevelStream({
                level: [bunyan.ERROR, bunyan.FATAL],
                stream: fs.createWriteStream(path.join(__dirname, '../logs/log-error.log'), {
                    flags: 'a',
                    encoding: 'utf8'
                })
            }),
        ]
    }

} else {
    settings = {
        name: 'dnd-tool-dev',
        streams: [
            {
                level: bunyan.DEBUG,
                type: 'raw',
                stream: bunyanDebugStream({
                    forceColor: true,
                    colors: {
                        info: 'white',
                        debug: 'white'
                    },
                    showPid: false,
                    showLoggerName: false
                })
            }
        ]
        //serializers: bunyanDebugStream.serializers
    }
}

module.exports = bunyan.createLogger(settings);


