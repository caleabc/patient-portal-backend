let mongoose = require("mongoose");

let medicalRecordSchema = new mongoose.Schema({
  patientId: { type: String, length: 32, required: true }, // This is a reference from patient model
  clinicId: { type: String, length: 32, required: true }, // This is a reference from clinic model
  createdAt: { type: Date, required: true },
  reasonForConsultation: { type: String, required: true },
  photos: [{ type: String }],
  remarks: { type: String },
  diagnosis: { type: String },
});

let MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
