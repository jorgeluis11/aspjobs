const express = require('express');
const router = express.Router();
const slug = require('slug')

const mongoose = require("mongoose");
const Jobs = require('../models/jobs');
const moment = require('moment');
const markdown = require('helper-markdown');
const forms = require('forms-mongoose');

router.get('/detail/:slug', (req, res, next) => {
  let slug = req.params.slug;

  Jobs.find({slug:slug}, (err, job) => {

    res.render('jobs-detail', {'job': job[0],
      formatDateTime: (datetime, format) => {
          return moment(datetime).format(format);
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
        },
      },
      'title': `Jobs Asp ${job[0].company_name}-${job[0].job_title}`,
      'metadescription': 'Asp jobs detail job section.'
    });
  })
});

router.get('/post', (req, res, next) => {
  res.render('insert',
    {
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
      'title': `Jobs Asp | Post New Job`,
      'metadescription': 'Asp jobs post new job section.'
    });
});

router.post('/new', (req, res, next) => {
  let job = new Jobs(req.body);
  job.save();
  res.json({success:true});
});



module.exports = router;
