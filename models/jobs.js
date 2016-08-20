var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var slug = require('mongoose-slug');

let jobsSchema = new Schema({
  textfield_27716413: { type: String, required: true, maxlength: 55}, // Job Title
  list_27717784_choice: { type: String, required: true, allowedValues: ['Full-time', 'Part-time', "Contract", "Freelance"] }, // Job Type
  textarea_27716421: { type: String, required: true, maxlength: 255 }, // Job Description
  list_27718927_choice: { type: String, required: true, allowedValues: ['Remote', 'OnSite'] }, // Location Type
  textfield_27716477: { type: String, required: true, maxlength: 55}, // Company Name
  textfield_27717637: String, // Company Url
  textfield_27716361: { type: String, required: true, maxlength: 55 }, // Company Location
  textarea_27716421: { type: String, required: true, maxlength: 255 }, // Company Description
  textarea_27716460: { type: String, required: true, maxlength: 255 }, // company_apply
//   meta: {
//     age: Number,
//     website: String
//   },
  metadata: {} // Additional information (date_submit, user_agent)
});

jobsSchema.plugin(slug(['job_title', 'company_name']));

module.exports = mongoose.model('Jobs', jobsSchema);
