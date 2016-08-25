const express = require('express');
const router = express.Router();
const slug = require('slug')

const mongoose = require("mongoose");
const Jobs = require('../models/jobs');
const moment = require('moment');

router.get('/:slug/:id', (req, res, next) => {
  var id = req.params.id;

  Jobs.find({'_id':id}, (err, job) => {
    res.render('jobs-detail', {'job': job,
      formatDate: (datetime, format) => {
        if (moment) {
          return moment(datetime).format(format);
        }
        else {
          return datetime;
        }
      },
      helpers: {
          'ifeq': (v1, v2, options) => {
          if(v1 === v2) {
            return options.fn(this);
          }
          return options.inverse(this);
        },
        'humanize': (v1, options) => {
            return  moment(v1).from(moment(), true);
        },
      }});
  })
});

router.get('/insert', (req, res, next) => {
  res.render('insert');
});


module.exports = router;
