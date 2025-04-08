let mongoose = require("mongoose");

let allowedPhoneNumberToRequestOtpSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true }, // Eg. 639123456789
});

let AllowedPhoneNumberToRequestOtp = mongoose.model("AllowedPhoneNumberToRequestOtp", allowedPhoneNumberToRequestOtpSchema);

module.exports = AllowedPhoneNumberToRequestOtp;
