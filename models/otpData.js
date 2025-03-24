let mongoose = require("mongoose");

let otpDataSchema = new mongoose.Schema({
  requestId: { type: String, length: 32, required: true }, // What is the purpose of requestId? OTP can encounter duplication with the help of requestId it determine where does the request come from and since the request has id then that is our way of identifying. Request ID must come from frontend / client
  otps: [{ type: Number, required: true }],
  createdAt: { type: Date, default: Date.now, index: { expires: '24h' } } // MongoDB will automatically delete the document 24 hour after it was created. No need to save the OTP permanently
});

let OtpData = mongoose.model("OtpData", otpDataSchema);

module.exports = OtpData;
