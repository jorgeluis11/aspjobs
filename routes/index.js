const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");

const hbs = require('express-handlebars');
const Handlebars = require('handlebars');
const HandlebarsIntl = require('handlebars-intl');
const moment = require('moment');
const slug = require('slug');

const Jobs = require('../models/jobs');


HandlebarsIntl.registerWith(Handlebars);

// hbs.create({
//   helpers: {
//             ifCond: function(v1, v2, options) {
//             if(v1 === v2) {
//               return options.fn(this);
//             }
//             return options.inverse(this);
//           }
//         }
// });

/* GET home page. */
router.get('/', function(req, res, next) {
 Jobs.find( function(err, jobs) {
      var jobs = jobs;

      console.log(jobs)

      res.render('jobs', {jobs: jobs,
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
    }).sort({ "metadata.date_submit": -1 });
});


module.exports = router;
