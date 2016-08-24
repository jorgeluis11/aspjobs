const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const Jobs = require('../models/jobs');
const moment = require('moment');

router.get('/view/:id', function(req, res, next) {
  var id = req.params.id;

  Jobs.find({'_id':id}, function(err, job) {
    res.render('jobs-detail', {'job': job,
      formatDate: function(datetime, format) {
        if (moment) {
          return moment(datetime).format(format);
        }
        else {
          return datetime;
        }
      },
      helpers: {
          'ifeq': function(v1, v2, options) {
          if(v1 === v2) {
            return options.fn(this);
          }
          return options.inverse(this);
        },
        'humanize': function(v1, options) {
            return  moment(v1).from(moment(), true);
        },
      }});
  })
});

router.get('/insert', function(req, res, next) {
  res.render('insert');
});


module.exports = router;
