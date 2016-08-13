var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var jobs = new Schema({
  job_title: { type: String, required: true, maxlength: 55},
  job_type: { type: String, required: true, allowedValues: ['Full-time', 'Part-time', "Contract", "Freelance"] },
  job_description: { type: String, required: true },
  location_type: { type: String, required: true, allowedValues: ['remote', 'OnSite'] },
  company_name: { type: String, required: true },
  company_url: String,
  company_location: String,
  company_description: String,
  company_apply: String,
//   meta: {
//     age: Number,
//     website: String
//   },
  created_at: Date,
  updated_at: Date
});
