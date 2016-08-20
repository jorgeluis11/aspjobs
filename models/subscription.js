var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let subscriptionSchema = new Schema({
  email: { type: String, required: true, maxlength: 55},
  job_type: { type: String, required: true, allowedValues: ['Daily', 'Weekly'] },
  created_at: Date,
  updated_at: Date,
  active: Boolean
});

module.exports = mongoose.model('Subscription', subscriptionSchema);