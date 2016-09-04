const express = require('express');
const router = express.Router();
const slug = require('slug')

const mongoose = require("mongoose");
const Jobs = require('../models/jobs');
const moment = require('moment');
const markdown = require('helper-markdown');

router.get('/:slug/:id', (req, res, next) => {
  var id = req.params.id;

  Jobs.find({'_id':id}, (err, job) => {
    res.render('jobs-detail', {'job': job,
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
      'title': `Jobs Asp | ${job[0].textfield_27716413}`,
      'metadescription': 'Asp jobs detail job section.'
    });
  })
});

router.get('/post', (req, res, next) => {
  res.render('insert',
    {
      'title': `Jobs Asp | Post New Job`,
      'metadescription': 'Asp jobs post new job section.'
    });
});


module.exports = router;
