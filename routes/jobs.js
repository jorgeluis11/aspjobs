const express = require('express');
const router = express.Router();
const slug = require('slug')

const mongoose = require("mongoose");
const Jobs = require('../models/jobs');
const Subscription = require('../models/subscription');

const moment = require('moment');
const markdown = require('helper-markdown');
const helper = require('sendgrid').mail;
const forms = require('forms-mongoose');
const path = require('path')
const EmailTemplate = require('email-templates').EmailTemplate


router.get('/detail/:slug', (req, res, next) => {
  let slug = req.params.slug;

  Jobs.find({slug:slug}, (err, job) => {
    console.log(job);
    res.render('jobs-detail', {'job': job[0],
      formatDateTime: (datetime, format) => {
        console.log(datetime);
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
      'title': `Asp Jobs - ${job[0].company_name}-${job[0].job_title}`,
      'metadescription': 'Asp Jobs | detail job section.'
    });
  })
});

router.get('/post', (req, res, next) => {
  res.render('insert',
    {
      formatDateTime: (datetime, format) => {
        console.log(datetime);
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
      'title': `Asp Jobs | Post New Job`,
      'metadescription': 'Asp jobs post new job section.'
    });
});

router.post('/new', (req, res, next) => {
  let job = new Jobs(req.body);
  job.save();
  res.json({success:true});
});


router.get('/daily', (req, res, next) => {
  //Jobs(req.body);
  // job.save();
  // res.json({success:true});
    let today = moment.utc().startOf('day')
    let tomorrow = moment(today).utc().add(1, 'days')

      Jobs.find({created_at: {
        $gte: today.toDate(),
        $lt: tomorrow.toDate()
        }
      }, (err, jobs) => {
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
                
        sendEmail(undefined, "../views/email/daily", data);
        
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

module.exports = router;
