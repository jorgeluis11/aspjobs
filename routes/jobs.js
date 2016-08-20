const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Jobs = require('../models/jobs');

/* GET users listing. */
router.get('/', function(req, res, next) {
    Jobs({
    job_title: "Job Title",
    job_type: "Full-time",
    job_description: 'Job Description',
    location_type: "OnSite" ,
    company_name: "Company Name",
    company_url: "www.google.com",
    company_location: "San Juan",
    company_description: 'Company Description',
    company_apply: 'Job Apply description',
    created_at: new Date(),
    updated_at: new Date()
  }).save();
  res.send(`insert`);

});

router.get('/view/:id', function(req, res, next) {
  var id = req.params.id;

  Jobs.find({id:id}, function(err, job) {
    res.render('jobs', {job: job});
  })
});

router.get('/insert', function(req, res, next) {
  Jobs({
    job_title: "Job Title",
    job_type: "Full-time",
    job_description: 'Job Description',
    location_type: "OnSite" ,
    company_name: "Company Name",
    company_url: "www.google.com",
    company_location: "San Juan",
    company_description: 'Company Description',
    company_apply: 'Job Apply description',
    created_at: new Date(),
    updated_at: new Date()
  }).save();
  res.send(`insert`);
});



module.exports = router;
