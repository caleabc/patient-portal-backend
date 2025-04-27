let mongoose = require("mongoose");

let doctorSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true }, // Example. "gnwkeiielzrcushfueovnhwiegbevjdc"
  firstname: { type: String},
  lastname: { type: String },
  specialty: { type: String },
  licenseNumber: { type: String },
  dateOfBirth: { type: String},
  gender: { type: String},
  phoneNumber: { type: String, required: true }, // Example. "+639123456789"
  doctorSignature: { type: String }, // Photo in base64String
  clinicId: { type: String, length: 32, required: true }, // This is a reference from clinic model
});

let Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
