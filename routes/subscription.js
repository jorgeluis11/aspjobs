const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Subscription = require('../models/subscription');
const Token = require('../models/token');
// const bodyParser = require('body-parser')

router.post('/insert', (req, res) => {
    if(!res.body.email && res.body.email.test(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
      res.json({success:false});
    }

    var token = Subscription.createVerificationToken();
    
    var subscription = Subscription({
      email: res.body.email,
      schedule: "Daily",
      verified: false
    }).save();


    Token({
      _subscription:subscription._id.$oid,
      token
    }).save();


    let subject = `<a href='http://localhost:3000/subscribe/${token}'>Subscribe</a>`;
    let content = new helper.Content('text/plain', 'Hello, Email!');

    let to_email = new helper.Email(item.email);
    var sg = require('sendgrid')("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");
    var sg = require('sendgrid')("process.env.sendGridAPI");
    let mail = new helper.Mail(from_email, subject, to_email, content)

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    });


    sg.API(request, function(error, response) {
      console.log(response.statusCode)
      console.log(response.body)
      console.log(response.headers)
    });

});

router.get('/subscribe/:token', (req, res) => {
  Subscription.ver
});


module.exports = router;
