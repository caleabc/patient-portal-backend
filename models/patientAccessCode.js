let mongoose = require("mongoose");

let patientAccessCodeSchema = new mongoose.Schema({
  accessCode: { type: String, length: 6, unique: true, required: true },
  patientId: { type: String, required: true }, // This is reference to 'id' in 'Patient' collection / Table
});

let PatientAccessCode = mongoose.model("PatientAccessCode", patientAccessCodeSchema);

module.exports = PatientAccessCode;
