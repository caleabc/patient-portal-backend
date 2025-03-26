let mongoose = require("mongoose");

let patientAccessCodeSchema = new mongoose.Schema({
  code: { type: String, length: 6, required: true }, // This is also the id, this is unique accross all patientAccessCode collection
  patientId: { type: String, required: true }, // This is reference to 'id' in Patient collection / Table
});

let PatientAccessCode = mongoose.model("PatientAccessCode", patientAccessCodeSchema);

module.exports = PatientAccessCode;
