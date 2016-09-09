const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");
const hbs = require('express-handlebars');
const Handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');
const moment = require('moment');
const slug = require('slug')

const Jobs = require('../models/jobs');


HandlebarsIntl.registerWith(Handlebars);



/* GET home page. */
router.get('/', (req, res, next) => {
  var todayCount = 0;
  var yesterdayCount = 0;
  var lastWeekCount = 0;
  var today = moment().format("MM-DD-YYYY");
  var yesterday = moment().add(-1, 'days').format("MM-DD-YYYY");
  var beforeYesterday = moment().add(-2, 'days').format("MM-DD-YYYY");
  console.log(today)
  console.log(yesterday)
  console.log(beforeYesterday)
  console.log("-------------------------")

  Jobs.find((err, jobs) => {
    res.render('jobs', {'jobs': jobs,
      helpers: {
          'ifeq': (v1, v2, options) => {
            if(v1 === v2) {
              return options.fn(this);
            }

            return options.inverse(this);
        },
        'humanize': (v1, options) => {
            return moment.utc(v1).from(moment(), true);
        },
        'getDay': (created_at) => {
          createdAtFormat = moment(created_at).format("MM-DD-YYYY");
          // console.log("Created At: ", createdAtFormat)
          //
          // console.log(moment(today).diff(createdAtFormat, 'days'))
          // console.log(moment(yesterday).diff(createdAtFormat, 'days'))
          // console.log(moment(beforeYesterday).diff(createdAtFormat, 'days'))

          console.log("-------------------------")
          if(todayCount <= 0 || yesterdayCount <= 0 || lastWeekCount <= 0)
          {

            if(todayCount <= 0 && moment(today).isSame(createdAtFormat, 'days') >= 0)
            {
                todayCount++;
                return "<h3>Today</h3>";
            }else if(yesterdayCount <= 0 && moment(yesterday).diff(createdAtFormat, 'days') >= 0){
              yesterdayCount++;
              return "<h3>Yesterday</h3>"
            }else if(lastWeekCount <= 0 && moment(beforeYesterday).diff(createdAtFormat, 'days') >= 0){
              lastWeekCount++;
              return "<h3>Last Week</h3>";
            }

          }
        }
      },
      'title': 'Jobs Asp',
      'metadescription': 'Asp jobs homepage section.'
    });
  }).sort({ "created_at": -1 });
});


module.exports = router;
