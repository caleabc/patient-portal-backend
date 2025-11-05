// Lib
let mongoose = require("mongoose");

let otpObjectSchema = new mongoose.Schema({
  requestorId: { type: String, length: 32, required: true }, // What is the purpose of requestorId?
  otp:{ type: Number, length: 6, required: true },
  userId:{ type: String, required: true },
  role:{ type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '1h' }
});

let OtpObject = mongoose.model("OtpObject", otpObjectSchema);

module.exports = OtpObject;

