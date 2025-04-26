let mongoose = require("mongoose");

let labRequestSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  doctorId: { type: String, length: 32, required: true },
  laboratoryTestsRequested: { type: String, required: true },
  instructionsToLaboratory: { type: String },
  doctorSignature: { type: String, required: true } // Photo in base64String
});

let prescriptionSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  doctorId: { type: String, length: 32, required: true },
  medicationInformation: { type: String, required: true },
  doctorSignature: { type: String, required: true } // Photo in base64String
});

// Main
let medicalRecordSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  patientId: { type: String, length: 32, required: true }, // This is a reference from patient model
  patientFirstAndLastName: { type: String, required: true }, // Why this field is here?
  doctorId: { type: String },
  clinicId: { type: String, length: 32, required: true }, // This is a reference from clinic model
  reasonForConsultation: { type: String, required: true },
  photos: [{ type: String }], // Photos in base64String
  labRequest: [{ type: labRequestSchema }],
  diagnosis: { type: String },
  prescription: [{ type: prescriptionSchema }],
  remarks: { type: String },
  createdAt: { type: Date, default: Date.now },
});

/*

Doing index can help prevent error like below,

MongoServerError: Executor error during find command: test.medicalrecords :: caused by :: Sort exceeded memory limit of 33554432 bytes

*/
medicalRecordSchema.index({ clinicId: 1, createdAt: -1 });

let MedicalRecord = mongoose.model("MedicalRecord", medicalRecordSchema);

module.exports = MedicalRecord;
