var express = require('express');
var path = require('path');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var expressSession = require('express-session');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
 var multer   =  require ('multer');
mongoose.Promise = require('bluebird');
var random = require('mongoose-simple-random');
var User = require('./models/User.js');
var logout = require('express-passport-logout');
var nodemailer= require ('nodemailer');   
var hashcash = require('nodemailer-hashcash');
var transporter= nodemailer.createTransport('smtps://shilarora10@gmail.com:plumpeach@smtp.gmail.com');    
var transporterSup=nodemailer.createTransport('smtps://shilwebsup@gmail.com:plumpeach@smtp.gmail.com');   
//transporter.use('compile', hashcash());   
//transporterSup.use('compile', hashcash());

mongoose.connect('mongodb://localhost/swing', function(err) {
  if(err) {
    console.log('error connecting', err);
  }else{
    console.log('connected');
  }
    });


var routes = require('./routes/routes');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressSession({ secret: 'ValiantSpaceDogs', resave: false,
  saveUninitialized: true, key: 'sid' }));
app.use(passport.initialize());
app.use(passport.session());
app.use('/', routes);
app.use(flash());


passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
/*not needed*/
/*passport.use(new LocalStrategy ({passReqToCallBack: true}, function(req, username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) return done(err);
      if (username === user.username && password === user.password) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
  }
));*/





// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
