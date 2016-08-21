var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug');

let jobsSchema = new Schema({
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
  created_at: { type: Date, default: Date.now },
  // updated_at: Date
});

jobsSchema.plugin(slug(['job_title', 'company_name']));


module.exports = mongoose.model('Jobs', jobsSchema);