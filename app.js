const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const routes = require('./routes/index');
const users = require('./routes/users');
const jobs = require("./routes/jobs");
const about = require("./routes/about");
const subscription = require("./routes/subscription");
const restApi = require("./routes/api");
const mongoose = require("mongoose");
const hbs = require('express-handlebars');
const schedule = require('node-schedule');
const helper = require('sendgrid').mail;
const Subscription = require('./models/subscription');

// mongoose.connect('process.env.DATABASE');
mongoose.connect('mongodb://AngryDevelopers1234:Test1234@ds013206.mlab.com:13206/aspjobs');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));


var handlebarsOptions = hbs.create({
    defaultLayout: 'layout',
    extname: '.hbs'
});

// app.set('view engine', 'hbs');
app.engine('.hbs', hbs(handlebarsOptions));
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
app.use('/about', about);
app.use('/subscription', subscription);
app.use('/api', restApi);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
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

var rule = new schedule.RecurrenceRule();
rule.second = 1;
// console.log(rule);
var j = schedule.scheduleJob(rule, function(){

  // Subscription.find({active:true,schedule:"Daily"}, function(error, subs){
  //   console.log(subs);
  //   let from_email = new helper.Email("no-reply@aspjobs.com");
  //   let subject = 'Hello World from the SendGrid Node.js Library!';
  //   let content = new helper.Content('text/plain', 'Hello, Email!');

  //   subs.map(function(item) {
  //     let to_email = new helper.Email(item.email);
  //     var sg = require('sendgrid')("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");
  //     var sg = require('sendgrid')("process.env.sendGridAPI");
  //     let mail = new helper.Mail(from_email, subject, to_email, content)

  //     var request = sg.emptyRequest({
  //       method: 'POST',
  //       path: '/v3/mail/send',
  //       body: mail.toJSON()
  //     });


  //     sg.API(request, function(error, response) {
  //       console.log(response.statusCode)
  //       console.log(response.body)
  //       console.log(response.headers)
  //     });
  //     }, this);

  // });

});

module.exports = app;
