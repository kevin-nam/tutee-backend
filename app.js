var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// Firebase
var firebase = require('firebase');
var config = {
  apiKey: 'AIzaSyBYbaQwELtNm4jxpEMHuws-vmlIRv1-YBA',
  authDomain: 'tutee-9b050.firebaseapp.com',
  databaseURL: 'https://tutee-9b050.firebaseio.com',
  storageBucket: 'tutee-9b050.appspot.com',
  messagingSenderId: '120931284750',
};
firebase.initializeApp(config);

// Services
var auth = require('./routes/auth');
var user = require('./routes/user');
var post = require('./routes/post');
var session = require('./routes/session');
var search = require('./routes/search');
var connection = require('./routes/connection');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hjs');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/mocha', express.static(path.join(__dirname, 'node_modules/mocha')));
app.use('/chai', express.static(path.join(__dirname, 'node_modules/chai')));
app.use('/tutee_modules', express.static(path.join(__dirname, 'tutee_modules')));

app.use('/auth', auth);
app.use('/user', user);
app.use('/post', post);
app.use('/session', session);
app.use('/search', search);
app.use('/connection', connection);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
