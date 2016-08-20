const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Subscription = require('../models/subscription');

router.get('/insert', function(req, res, next) {
  Subscription({
    email: "angrydeveloperspr@gmail.com",
    schedule: "Daily",
    created_at: new Date(),
    updated_at: new Date(),
    active: true
  }).save();
  res.send(`insert`);
});



module.exports = router;
