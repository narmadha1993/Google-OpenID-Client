var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
//var util=require('util');
var googlestrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new googlestrategy({
  clientID:'',
  clientSecret:'',
  callbackURL:'http://localhost:8000/auth/google/callback'
},
function (accesstoken,refreshToken,profile,cb){
console.log(profile);
console.log('access');
console.log(accesstoken);
  return cb(null,profile);
}))
passport.serializeUser(function(user, cb) {
 cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
 cb(null, obj);
});

var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/profile',function(req,res,next){
  var cookie=req.cookies;
  if(cookie)
  {

   console.log('cookie exists',cookie);

   res.cookie(cookie["connect.sid"]);
   //console.log(JSON.stringify(cookie,null,4));
  // res.set({"Content-Type":"text/plain"})
  // res.status(200)

   res.cookie(cookie);
   //res.set({"Content-Type":"text/plain"})
  // res.status(200)

 }
  else
    {
      console.log('no cookies');
      }
      next();

      //res.end();

});

app.use(express.static(path.join(__dirname, 'public')));
app.use(require('express-session')({secret : 'keyboard cat', resave:true, saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/googlelogin',routes);
app.use('/auth/google/callback',routes);
app.use('/profile',routes);
app.use('/users', users);

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
