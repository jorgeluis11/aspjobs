const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const uuid = require('node-uuid');
const helper = require('sendgrid').mail;

const Subscription = require('../models/subscription');
const Token = require('../models/token');

router.post('/insert', (req, res) => {
  console.log(req.body)
    if(!req.body.email && req.body.email.test(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
      req.json({success:false});
    }

    var token = uuid.v4();
    
    var subscription = Subscription({
      email: req.body.email,
      schedule: "Daily",
      verified: false
    });
    subscription.save((error, subs) => {
    Token({
      _subscription:subs.id,
      token
    }).save();

    let from_email = new helper.Email("hello@aspjobs.com");
    let subject = `ASP Jobs: Please Confirm Subscription`;
    let content = new helper.Content('text/html', "<a href='http://localhost:3000/subscription/confirm/"+ token +"'>Subscribe</a>");

    let to_email = new helper.Email(req.body.email);
    var sg = require('sendgrid')("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");
    // var sg = require('sendgrid')("process.env.sendGridAPI");
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

    res.render("verify");
    });

    

});

router.get('/confirm/:token', (req, res) => {
  Token.find({token:req.params.token}, (err, token)=>{
    console.log(token);
    res.send("confirmed!");
  });
 
});


module.exports = router;
