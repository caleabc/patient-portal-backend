// Lib
let mongoose = require("mongoose");

// Utils
let { encrypt, decrypt } = require("../utils/cryptography")

let encryptionKey = process.env.ENCRYPTION_KEY_ON_SAVING_TO_DATABASE

let patientSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  gender: { type: String },
  phoneNumber: { type: String }
});

/*

Encrypt before saving

*/
patientSchema.pre("save", function (next) {
  this.firstname = encrypt(this.firstname, encryptionKey);
  this.lastname = encrypt(this.lastname, encryptionKey);
  this.dateOfBirth = encrypt(this.dateOfBirth, encryptionKey);
  this.phoneNumber = encrypt(this.phoneNumber, encryptionKey);
  
  next();
});

/*

Decrypt on retrieval

You need to call this method on retrieval

Eg.
let patient = await Patient.findById('someId');

// Decrypt patient
patient = patient.decrypt();

*/
patientSchema.methods.decrypt = function () {
  const obj = this.toObject();
  obj.firstname = decrypt(obj.firstname, encryptionKey);
  obj.lastname = decrypt(obj.lastname, encryptionKey);
  obj.dateOfBirth = decrypt(obj.dateOfBirth, encryptionKey);
  obj.phoneNumber = decrypt(obj.phoneNumber, encryptionKey);

  return obj;
};

let Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
