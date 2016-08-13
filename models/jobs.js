var mongoose = require('mongoose');
var Schema = mongoose.Schema;

let Jobs = new Schema({
  job_title: { type: String, required: true, maxlength: 55},
  job_type: { type: String, required: true, allowedValues: ['Full-time', 'Part-time', "Contract", "Freelance"] },
  job_description: { type: String, required: true, maxlength: 255 },
  location_type: { type: String, required: true, allowedValues: ['Remote', 'OnSite'] },
  company_name: { type: String, required: true, maxlength: 55},
  company_url: String,
  company_location: { type: String, required: true, maxlength: 55 },
  company_description: { type: String, required: true, maxlength: 255 },
  company_apply: { type: String, required: true, maxlength: 255 },
//   meta: {
//     age: Number,
//     website: String
//   },
  created_at: Date,
  updated_at: Date
});

module.exports = Jobs;
