'use strict';

const config = require('config');
const path = require('path');
const express = require('express');
const helmet = require('helmet');
const logger = require('logger');
const bunyanMiddleware = require('bunyan-middleware');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const api = require('api');


//
// init Express
//
const app = express();


// helmet
if (config.IS_PROD) // disable for local network
    app.use(helmet());

// log all requests
app.use(bunyanMiddleware({logger}));

// static
app.use(express.static(path.join(__dirname, 'client/build/')));
//app.use(express.static('uploads'));

// parsing data
app.use(express.json()); // == body
app.use(express.urlencoded({ extended: false }));

// session
app.use(cookieParser());
app.use(session({
    key: 'sid',
    secret: config.COOKIE_SECRET,
    resave: true,
    rolling: true,
    saveUninitialized: false,
    cookie: {
        maxAge: config.SESSION_AGE,
        httpOnly: true
    }
}));


app.use((req, res, next) => {
    console.log('session: ', req.session.id);
    console.log('user: ', req.session.user ? req.session.user.id +' | '+req.session.user.username : '');
    next();
});


// api routs
app.use('/api', api);

// all other routs to index.html from client build
app.use((req, res, next) => {
    res.sendFile(path.join(__dirname, 'client/build/index.html'));
});



// error handler
app.use((err, req, res, next) => {
//    if (!res.headersSent) {
    res.status(err.status || 500);
    res.send(typeof err === 'string' ? err : err.message);
});

module.exports = app;
