let mongoose = require("mongoose");

/*

Phone number schema is only applicable to secretary and doctor

*/
let phoneNumberSchema = new mongoose.Schema({
  phoneNumber: { type: String, unique: true, required: true }, // Eg. +639123456789
  role: { type: String, required: true }, // secretary or doctor
  id: { type: String, length: 32, required: true }, // If role is secretary then this "id" is pointing to secretary schema "id" field, if role is doctor then this "id" is pointing to doctor schema "id" field
  clinicId: { type: String, length: 32, required: true },
});

let PhoneNumber = mongoose.model("PhoneNumber", phoneNumberSchema);

module.exports = PhoneNumber;
