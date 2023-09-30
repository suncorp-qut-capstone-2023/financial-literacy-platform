// Desc: Main entry point for the application

// For environment variables
require("dotenv").config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const helmet = require('helmet');
const cors = require("cors");
const yaml = require('js-yaml');
const fs = require ('fs');
const swaggerUI = require("swagger-ui-express");

// swagger setup
try {
  swaggerDocument = yaml.load(fs.readFileSync('./swagger.yaml', 'utf8'));
} catch (e) {
  console.error("Failed to load swagger document", e);
}

const app = express(); // create express app

// define routers
const aboutUsRouter = require('./routes/aboutUs.js');
const usersRouter = require('./routes/users.js');
const learningModulesRouter = require('./routes/learningModules.js'); // TODO
const modulesRouter = require('./routes/courses.js'); // TODO
const forumRouter = require('./routes/forum.js');
const enrolmentRouter = require('./routes/enrolment.js');
const mediaRouter = require('./routes/media.js');

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

app.use(cookieParser()); // cookie parser implementation
app.use(logger('common')); // logger implementation

// logger token implementation
logger.token('req', (req, res) => JSON.stringify(req.headers));
logger.token('res', (req, res) => {
    const headers = {}
    res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
    return JSON.stringify(headers)
});

// swagger implementation
app.use('/api/docs', swaggerUI.serve);                  // TODO
//@ts-ignore
app.get('/api/docs', swaggerUI.setup(swaggerDocument)); // TODO

// Setup routes
app.use('/api', aboutUsRouter);
app.use('/api/user', usersRouter);
app.use('/api/learningModules', learningModulesRouter); // TODO
app.use('/api/modules', modulesRouter);                 // TODO
app.use('/api/forum', forumRouter);
app.use('/api/enrolment', enrolmentRouter);
app.use('/api/media', mediaRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;