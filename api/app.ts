var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require("cors");
require("dotenv").config();

const options = require('./knexfile');
const knex = require("knex")(options);
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json")

// define routes
const aboutUsRouter = require('./routes/aboutus.ts');
const helmet = require('helmet');

var app = express();

app.use((req,res,next) => {
  req.db = knex;
  next();
})

app.use(helmet());
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('common'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

logger.token('req', (req, res) => JSON.stringify(req.headers));
logger.token('res', (req, res) => {
  const headers = {}
  res.getHeaderNames().map(h => headers[h] = res.getHeader(h))
  return JSON.stringify(headers)
});

app.get('/knex', function(req,res,next){
  req.db.raw("SELECT VERSION()")
  .then((version) => console.log(version[0][0]))
  .catch((err) => {console.log(err); throw err;})
  res.send("Version logged successfully")
});

app.use('/', swaggerUI.serve);
app.get('/', swaggerUI.setup(swaggerDocument));

// Setup routes
app.use('/aboutus', aboutUsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  console.log(req);
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