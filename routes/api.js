const express = require('express');
const router = express.Router();

const Jobs = require('../models/jobs');


router.get('/jobs/', (req, res, next) => {
  Jobs.find((err, jobs) => {
    res.json(jobs).sort({ "metadata.date_submit": -1 });
  });
});


router.get('/jobs/:id/', (req, res, next) => {
  var id = req.params.id;

  Jobs.find({'_id':id}, (err, job) => {
    res.json(job)
  });
});


module.exports = router;
