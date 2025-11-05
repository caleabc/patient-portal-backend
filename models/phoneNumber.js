let mongoose = require("mongoose");

let phoneNumberSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true }, // Eg. +639123456789
  role: { type: String, required: true }, // Patient or Secretary or Doctor
  userId: { type: String, length: 32, unique: true, required: true }, // If role is secretary then this "userId" is pointing to secretary schema "id" field, if role is doctor then this "id" is pointing to doctor schema "id" field
  clinicId: { type: String, length: 32, unique: true, required: true },
  firstname: { type: String },
  lastname: { type: String }
});

let PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

module.exports = PhoneNumber;

