require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var exphbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
const { loggers, transports ,format} = require('winston');
loggers.add(process.env.LOGGER_NAME, {
  level: 'info',
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(
      info => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new transports.File({
      filename: './logs/'process.env.LOGGER_NAME'.log',
      datePattern: 'YYYY-MM-DD',
      level: 'info',
    }),
  ]
});

const logger = loggers.get(process.env.LOGGER_NAME)

var app = express();

// view engine setup
app.engine('hbs', exphbs({extname: '.hbs'}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

logger.info('Starting 'process.env.LOGGER_NAME'...')
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var routes = require('./routes/index.js');
routes(app);

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
