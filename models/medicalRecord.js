let mongoose = require("mongoose");

let medicalRecordSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  patientId: { type: String, length: 32, required: true }, // This is a reference from patient model
  patientFirstAndLastName: { type: String, required: true }, // Why this field is here?
  clinicId: { type: String, length: 32, required: true }, // This is a reference from clinic model
  createdAt: { type: Date, default: Date.now },
  reasonForConsultation: { type: String, required: true },
  photos: [{ type: String }], // Photos in base64String
  diagnosis: { type: String },
  remarks: { type: String },
});

let MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
