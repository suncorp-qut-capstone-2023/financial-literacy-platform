// Description: This file is the main entry point for the application. It sets up the express app,
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const pug = require('pug');

// security setup
const helmet = require('helmet');
const cors = require("cors");
require("dotenv").config();

// swagger setup
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

// create express app
const app = express();

// define routers
const aboutUsRouter = require('./routes/aboutUs.js');
const usersRouter = require('./routes/users.js');
const learningModulesRouter = require('./routes/learningModules.js');

// security implementation
app.use(helmet());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// express implementation
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// cookie parser implementation
app.use(cookieParser());

// logger implementation
app.use(logger('common'));

// logger token implementation
logger.token('req', (req, res) => JSON.stringify(req.headers));
logger.token('res', (req, res) => {
    const headers = {}
    res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
    return JSON.stringify(headers)
});

// swagger implementation
app.use('/api/docs', swaggerUI.serve);
//@ts-ignore
app.get('/api/docs', swaggerUI.setup(swaggerDocument));

// Setup routes
app.use('/api', aboutUsRouter);
app.use('/api/user', usersRouter);
app.use('/api/learningModules', learningModulesRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;