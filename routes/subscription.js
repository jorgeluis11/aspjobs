const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Subscription = require('../models/subscription');
const Token = require('../models/token');
const uuid = require('node-uuid');
const helper = require('sendgrid').mail;

router.post('/insert', (req, res) => {
  console.log(req.body)
    if(!req.body.email && req.body.email.test(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
      req.json({success:false});
    }
    
    Subscription.findOne({email: req.body.email},function( err, sub){
      if(!sub){
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
          res.render("verify", {message:'Activate your subscription on your <a target="_blank" href="https://mail.google.com/mail/u/0/#search/aspjobs">emails address</a>'});
        });

      }else{

        if(sub.active){
          res.render("verify", {message:'This email address is already subscribed.'});
        }else{
          Token.findOne({_subscription: sub.id},function( err, t){
            if(t){
              console.log("token already created");
              var token = uuid.v4();

              let from_email = new helper.Email("hello@aspjobs.com");
              let subject = `ASP Jobs: Please Confirm Subscription`;
              let content = new helper.Content('text/html', "<a href='http://localhost:3000/subscription/confirm/"+ t.token +"'>Subscribe</a>");

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
              res.render("verify", {message:'The email confirmation was sent, verify your subscription in your <a target="_blank" href="https://mail.google.com/mail/u/0/#search/aspjobs">email address</a>'});
            }else{
              console.log("token not created");
              var token = uuid.v4();
              
              Token({
                _subscription:sub.id,
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
              res.render("verify", {message:'The email confirmation was sent, verify your subscription in your <a target="_blank" href="https://mail.google.com/mail/u/0/#search/aspjobs">email address</a>'});
            }
          });

        }  

      }
    });
});


router.get('/confirm/:token', (req, res) => {
  Token.findOne({token:req.params.token}, (err, token)=>{
    if(!token){
      // redirect("index")
    }
    console.log(token._subscription);
    Subscription.findById(token._subscription, ( err, sub) => {
      console.log("sub",sub);
      sub.verified = true;
      sub.save()
      token.remove();
      res.render("verify", {message:'Thanks for your subscribtion!'});
    });
  });
});

module.exports = router;
