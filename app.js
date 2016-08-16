<<<<<<< HEAD
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var jobs = require("./routes/jobs");
const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/aspjobs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/jobs', jobs);

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

=======
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const users = require('./routes/users');
const jobs = require('./routes/jobs');
const mongoose = require("mongoose");
const hbs = require('express-hbs');

mongoose.connect('mongodb://localhost/aspjobs');

let app = express();

app.engine('hbs', hbs.express4({
  partialsDir: __dirname + '/views'
}));

// hbs.registerPartial('userMessage',
//     '');

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

// var hbs = handlebars.create({
//   partialsDir :__dirname
//  });

//  hbs.engine(__dirname + "/views/index.html", {name:"Jakob"}, function(err, html) {
//   if (err) {
//     throw err;
//   }
//   console.log(html);
// }); 

class Server {

    constructor() {
        this.config();
        this.routeConfig();
        this.errorConfig();
    }

    config() {
        app.use(logger('dev'));
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({extended: false}));
        app.use(cookieParser());
        app.use(require('node-sass-middleware')({
            src: path.join(__dirname, 'public'),
            dest: path.join(__dirname, 'public'),
            indentedSyntax: true,
            sourceMap: true
        }));
        app.use(express.static(path.join(__dirname, 'public')));
        app.use("/stylesheets",express.static(__dirname + "/stylesheets"));
        console.log(path.join(__dirname, 'public'));
    }

    routeConfig() {
        app.use('/', routes);
        app.use('/users', users);
        app.use('/job', jobs);

        app.use((req, res, next) => {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });
    }

    errorConfig() {
        if (app.get('env') === 'development') {
            app.use((err, req, res, next) => {
                res.status(err.status || 500);
                res.render('error', {
                    message: err.message,
                    error: err
                });
            });
        }

        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: {}
            });
        });
    }

    static bootstrap() {
        return new Server();
    }
}

Server.bootstrap();
>>>>>>> 65262abb3ad78f4ef045f11a13e99c4d70904c6c

module.exports = app;
