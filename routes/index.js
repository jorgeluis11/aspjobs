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
  var showToday = false;
  var showYesterday = false;
  var showThisWeek = false;
  var showThisMonth = false;
  var showBeforeThisMonth = false;
  var today = moment().format("MM-DD-YYYY");
  var yesterday = moment().add(-1, 'days').format("MM-DD-YYYY");

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
          if(showToday == false || showYesterday == false ||
             showThisWeek == false || showThisMonth == false ||
             showBeforeThisMonth == false)
          {
            var createdAtFormat = moment(created_at).format("MM-DD-YYYY");

            if(showToday == false && today == createdAtFormat)
            {
                showToday = true;
                return "<h3 class='days-divider'>Today</h3>";
            }else if(showYesterday == false && yesterday == createdAtFormat){
              showYesterday = true;
              return "<h3 class='days-divider'>Yesterday</h3>"
            }else if(showThisWeek == false && moment(today).diff(createdAtFormat, 'days') >= 3 &&
                     moment(today).diff(createdAtFormat, 'days') <= 7){
              showThisWeek = true;
              return "<h3 class='days-divider'>This Week</h3>";
            }else if(showThisMonth == false && moment(today).diff(createdAtFormat, 'days') >= 8 &&
                     moment(today).diff(createdAtFormat, 'days') <= 30){
              showThisMonth = true;
              return "<h3 class='days-divider'>The Last 30 Days</h3>";
            }else if(showBeforeThisMonth == false && moment(today).diff(createdAtFormat, 'days') > 30){
              showBeforeThisMonth = true;
              return "<h3 class='days-divider'>Before 30 days</h3>";
            }
          }
        }
      },
      'title': 'Home Page',
      'metadescription': 'Asp jobs homepage section.'
    });
  }).sort({ "created_at": -1 });
});


module.exports = router;
