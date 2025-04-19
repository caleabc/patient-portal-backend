let mongoose = require("mongoose");

let patientSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String },
  phoneNumber: { type: String }
});

let Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
