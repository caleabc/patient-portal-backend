let mongoose = require("mongoose");

/*

Phone number schema is only applicable to secretary and doctor

*/
let phoneNumberSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true }, // Eg. +639123456789
  role: { type: String, required: true }, // secretary or doctor
  clinicId: { type: String, length: 32, required: true }
});

let PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

module.exports = PhoneNumber;
