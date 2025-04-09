/*
README

What is the reason on the design of OtpData collection?

*/

let mongoose = require("mongoose");

let otpSchema = new mongoose.Schema({
  otp: {type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Main
let otpDataSchema = new mongoose.Schema({
  requestorId: { type: String, length: 32, required: true }, // What is the purpose of requestorId? OTP can encounter duplication with the help of requestorId it determine where does the request come from and since the request has id then that is our way of identifying. Requestor ID must come from frontend / client
  phoneNumber: { type: String, required: true}, // Example. "+639123456789"
  otps: [otpSchema],
  createdAt: { type: Date, default: Date.now, expires: '720h' } // Mongoose will tell MongoDB to automatically delete the document 30 days after it was created. No need to save the OTP permanently
});

let OtpData = mongoose.model("OtpData", otpDataSchema);

module.exports = OtpData;
