var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')



db=require('./config/connection')
db.connect((err)=>{

if(err) console.log('connection error')
else console.log('Data base connected')

})


var app = express();



app.use(session({

  resave :false,
  saveUninitialized: true,
  secret:'key',
  cookie:{maxAge:60000000000}

}))
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
})

var indexRouter = require('./routes');
var adminRouter = require('./routes/admin')





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// const ejslayout = require('express-ejs-layouts');
// app.use(ejslayout)

// app.set('layout','./layout/layout')



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/admin', adminRouter);



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
