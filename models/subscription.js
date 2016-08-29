const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Token = require('./token');
const uuid = require('node-uuid');
const helper = require('sendgrid').mail;

// const Subscription = require('./models/subscription');

let subscriptionSchema = new Schema({
  email: { type: String, required: true, maxlength: 55, unique: true},
  schedule: { type: String, required: true, allowedValues: ['Daily', 'Weekly'] },
  created_at: {type: Date, required: true, default: Date.now},
  verified: Boolean,
  // token: {type: String, required: true},
});

subscriptionSchema.statics.createSubscription = (email) =>{
      console.log("Create!");
      var token = uuid.v4();

      var subscription = subscriptionSchema({
            email: email,
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

    });

}

module.exports = mongoose.model('Subscription', subscriptionSchema);