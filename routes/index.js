var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const Jobs = require('../models/jobs');
const hbs = require('express-handlebars');

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
 Jobs.find({}, function(err, jobs) {
      res.render('jobs', {jobs: jobs, 
        helpers: {
            'ifeq': function(v1, v2, options) {
            if(v1 === v2) {
              return options.fn(this);
            }
            return options.inverse(this);
          }
        }});
    })
});

module.exports = router;
