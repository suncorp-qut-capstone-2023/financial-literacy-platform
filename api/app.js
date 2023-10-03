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
const forumRouter = require('./routes/forum.js');
const enrolmentRouter = require('./routes/enrolment.js');

const coursesRouter = require('./routes/all-courses.js');
const modulesRouter = require('./routes/all-modules.js');
const quizzesRouter = require('./routes/all-quizzes.js');
const quizQuestionsRouter = require('./routes/all-quiz-questions.js');
const lecturesRouter = require('./routes/all-lectures.js');
const lectureContentsRouter = require('./routes/all-lecture-contents.js');
const mediasRouter = require('./routes/all-lecture-content-media.js');

const courseRouter = require('./routes/course.js');
const moduleRouter = require('./routes/module.js');
const quizRouter = require('./routes/quiz.js');
const quizQuestionRouter = require('./routes/quiz-question.js');
const lectureRouter = require('./routes/lecture.js');
const lectureContentRouter = require('./routes/lecture-content.js');
const lectureContentMediaRouter = require('./routes/lecture-content-media.js');

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

// Setup old-routes
app.use('/api', aboutUsRouter);                                                     // ABOUT US ROUTES
app.use('/api/user', usersRouter);                                                  // USER ROUTES
app.use('/api/forum', forumRouter);                                                 // FORUM ROUTES
app.use('/api/enrolment', enrolmentRouter);                                         // ENROLMENT ROUTES

app.use('/api/courses', coursesRouter);                                             // FETCH ALL COURSES
app.use('/api/course/modules', modulesRouter);                                      // FETCH ALL MODULES
app.use('/api/course/module/lectures', lecturesRouter);                             // FETCH ALL LECTURES
app.use('/api/course/module/lecture/contents', lectureContentsRouter);              // FETCH ALL QUIZ QUESTIONS
app.use('/api/course/module/quizzes', quizzesRouter);                               // FETCH ALL QUIZZES
app.use('/api/course/module/quiz/questions', quizQuestionsRouter);                  // FETCH ALL QUIZ QUESTIONS
app.use('/api/course/module/lecture/content/medias', mediasRouter);                 // FETCH ALL LECTURE CONTENT MEDIA

app.use('/api/course', courseRouter);                                               // COURSE ROUTES
app.use('/api/course/module', moduleRouter);                                        // MODULE ROUTES
app.use('/api/course/module/quiz', quizRouter);                                     // QUIZ ROUTES
app.use('/api/course/module/quiz/question', quizQuestionRouter);                    // QUIZ QUESTION ROUTES
app.use('/api/course/module/lecture', lectureRouter);                               // LECTURE ROUTES
app.use('/api/course/module/lecture/content', lectureContentRouter);                // LECTURE CONTENT ROUTES
app.use('/api/course/module/lecture/content/media', lectureContentMediaRouter);     // LECTURE CONTENT MEDIA ROUTES


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