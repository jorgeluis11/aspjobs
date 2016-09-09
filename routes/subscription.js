const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Subscription = require('../models/subscription');
const Token = require('../models/token');
const uuid = require('node-uuid');
const helper = require('sendgrid').mail;
const EmailTemplate = require('email-templates').EmailTemplate
const path = require('path')
const moment = require('moment');

router.post('/insert', (req, res) => {
    if(!req.body.email && req.body.email.test(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)){
      req.json({success:false});
    }
    const token = uuid.v4();

    Subscription.findOne({email: req.body.email},function( err, sub){

      if(!sub){
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
          sendEmail(token, req.body.email);
          res.render("verify", {message:'Activate your subscription on your <a target="_blank" href="https://mail.google.com/mail/u/0/#search/aspjobs">emails address</a>'});
        });

      }else{

        if(sub.verified){
          res.render("verify", {message:'Your email address is already subscribed.'});
        }else{
          Token.findOne({_subscription: sub.id},function( err, t){
            if(t){
              console.log("token already created");
              console.log(t);
              var date = moment(t.created_at).day();
              var now = moment().day();

              if (now !== date) {
                  t.created_at = moment();
                  t.save();
                  sendEmail(t.token, req.body.email);
              } 

              res.render("verify", {message:'The confirmation email was sent, verify your <a target="_blank" href="https://mail.google.com/mail/u/0/#search/aspjobs">email address</a>'});

            }else{
              Token({
                _subscription:sub.id,
                token
              }).save();

              sendEmail(token, req.body.email);

              res.render("verify", {message:'The email confirmation was sent, verify your subscription in your <a target="_blank" href="https://mail.google.com/mail/u/0/#search/aspjobs">email address</a>'});
            }
          });

        }

      }
    });
});


function sendEmail(token, email){

    let templateDir = path.join(__dirname, '../views/email/subscribe');
    let subscribe = new EmailTemplate(templateDir)
    let data = {url:"http://aspjobs.herokuapp.com/subscription/confirm/"+ token, page:"aspjobs.herokuapp.com"}

    subscribe.render(data, function (err, result) {
      let from_email = new helper.Email("hello@aspjobs.com");
      let subject = `ASP Jobs: Please Confirm Subscription`;

      let content = new helper.Content('text/html', result.html);

      let to_email = new helper.Email(email);
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
  })
}


router.get('/confirm/:token', (req, res) => {
  Token.findOne({token:req.params.token}, (err, token)=>{
    if(!token){
      res.render("verify", {message:'Your account is already subscribed.'});
    }
    console.log(token._subscription);
    Subscription.findById(token._subscription, ( err, sub) => {
      console.log("sub",sub);
      sub.verified = true;
      sub.save()
      token.remove();
      res.render("verify", {message:'Thanks for your subscribtion.'});
    });
  });
});

router.get('/test', (req, res) => {
    let templateDir = path.join(__dirname, '../views/email/subscribe');
    let subscribe = new EmailTemplate(templateDir)
    let data = {url:"google.com",page:"amazon.com"}
    console.log(subscribe);
    subscribe.render(data, function (err, result) {
      res.send(result.html);
    })

});

module.exports = router;
