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
        slug: (title) => {
          if (title) {
            return slug(title);
          }

          return "";
        },
      },
      'title': 'Jobs Asp',
      'metadescription': 'Asp jobs homepage section.'
    });
  }).sort({ "metadata.date_submit": -1 });
});


module.exports = router;
