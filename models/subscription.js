const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let subscriptionSchema = new Schema({
  email: { type: String, required: true, maxlength: 55},
  schedule: { type: String, required: true, allowedValues: ['Daily', 'Weekly'] },
  created_at: {type: Date, required: true, default: Date.now},
  verified: Boolean,
  // token: {type: String, required: true},
});

module.exports = mongoose.model('Subscription', subscriptionSchema);