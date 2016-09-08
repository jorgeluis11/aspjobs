const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const slug = require('mongoose-slug');
const forms = require('forms-mongoose');

let jobsSchema = new Schema({
  job_title: { type: String, required: true, maxlength: 55}, // Job Title
  job_type: { type: String, required: true, allowedValues: ['Full-time', 'Part-time', "Contract", "Freelance"] }, // Job Type
  job_description: { type: String, required: true }, // Job Description
  location_type: { type: String, required: true, allowedValues: ['Remote', 'OnSite'] }, // Location Type
  company_name: { type: String, required: true, maxlength: 55}, // Company Name
  company_url: {type: String, maxlength: 200,  required: true}, // Company Url
  company_location: { type: String, required: true, maxlength: 55 }, // Company Location
  company_apply: { type: String, required: true }, // company_apply
  company_description: String, // Job Description
  created_at: { type: Date, default: Date.now },
});

jobsSchema.plugin(slug(['company_name', 'job_title']));

module.exports = mongoose.model('Jobs', jobsSchema);
