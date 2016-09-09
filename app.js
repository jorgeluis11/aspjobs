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
const sm = require('sitemap')

const EmailTemplate = require('email-templates').EmailTemplate


const Jobs = require('./models/jobs');
const Subscription = require('./models/subscription');
const moment = require('moment');

// mongoose.connect('process.env.DATABASE');
mongoose.connect('mongodb://AngryDevelopers1234:Test1234@ds013206.mlab.com:13206/aspjobs');

const app = express(),
  sitemap = sm.createSitemap ({
      hostname: 'http://jobsasp.com',
      cacheTime: 600000,
      urls: [
        { url: '/',  changefreq: 'daily', priority: 1 },
        // { url: '/jobs/:slug/:id',  changefreq: 'weekly',  priority: 0.5 },
        { url: '/about/', changefreq: 'monthly',  priority: 0.4 },
        { url: '/jobs/post/', changefreq: 'monthly',  priority: 0.8 }
      ]
  });

app.get('/sitemap.xml', (req, res) => {
  sitemap.toXML( (err, xml) => {
      if (err) {
        return res.status(500).end();
      }
      res.header('Content-Type', 'application/xml');
      res.send( xml );
  });
});

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
app.use((req, res, next) => {
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
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  // respond with html page
  if (req.accepts('html')) {
    res.render('500', { url: req.url });
    return;
  }
});

var rule = new schedule.RecurrenceRule();
rule.second = 1;
// console.log(rule);
// var j = schedule.scheduleJob(rule, () =>{

  // Subscription.find({active:true,schedule:"Daily"}, function(error, subs){
  //   console.log(subs);
  //   let from_email = new helper.Email("no-reply@aspjobs.com");
  //   let subject = 'Hello World from the SendGrid Node.js Library!';
  //   let content = new helper.Content('text/plain', 'Hello, Email!');

  //   subs.map((item) => {
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

// });


var j = schedule.scheduleJob("0 0 4 1/1 * ? *", () =>{
  //Jobs(req.body);
  // job.save();
  // res.json({success:true});
    let today = moment.utc().add(-1,"Day");
    let tomorrow = moment.utc(); 

      Jobs.find({created_at: {
          $gte: today.toDate(),
          $lt: tomorrow.toDate()
          }
        }).sort({ "created_at": -1 }).find({}, (err, jobs) => {

        if(jobs.length === 0)
          return;
        let templateDir = path.join(__dirname, "../views/email/daily");//'../views/email/subscribe');
        let subscribe = new EmailTemplate(templateDir);
        let data = {
        formatDateTime: (datetime, format) => {
            return moment(datetime).format(format);;
        },
        helpers: {
          'ifeq': (v1, v2, options) => {
            if(v1 === v2) {
              return options.fn(this);
            }
            return options.inverse(this);
          },
          'humanize': (v1, options) => {
              return  moment.utc(v1).from(moment(), true);
          },
          markdown: (text) => {
            if(text != null && text != '') {
              return markdown(text);
            }
            return "";
          }
        },
        jobs,
        job_count:jobs.length,
        page:"https://aspjobs.herokuapp.com"}
                
        sendEmail(undefined, "./views/email/daily", data);
        
  });
});


function sendEmail(email, template, data){
 
    let templateDir = path.join(__dirname, template);//'../views/email/subscribe');
    let subscribe = new EmailTemplate(templateDir);
   
    subscribe.render(data, function (err, result) {
      let from_email = new helper.Email("hello@aspjobs.com");
      let subject = `ASP Jobs has ${data.jobs.length} positions avalible!`;

      let content = new helper.Content('text/html', result.html);

      var sg = require('sendgrid')("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");
      // var sg = require('sendgrid')("process.env.sendGridAPI");

       Subscription.find({verified:true}, function(err, subs){
         subs.forEach(function(item) {
            let to_email = new helper.Email(item.email);
            let mail = new helper.Mail(from_email, subject, to_email, content)
            var request = sg.emptyRequest({
              method: 'POST',
              path: '/v3/mail/send',
              body: mail.toJSON(),
              title:"AspJobs"
            });

            sg.API(request, function(error, response) {
              // console.log(response.statusCode)
              // console.log(response.body)
              // console.log(response.headers)
            });
         }, this);
        
      }); 
  })
}

module.exports = app;
