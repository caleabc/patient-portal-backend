let mongoose = require("mongoose");

let phoneNumberSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true }, // Eg. +639123456789
  clinicId: { type: String, required: true },
  clinicName: { type: String, required: true }, // Same clinic name is allowed but must have a different clinicId
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, required: true }, // secretary or doctor
});

let PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

module.exports = PhoneNumber;
