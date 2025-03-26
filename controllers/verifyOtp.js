const OtpData = require("../models/otpData");

async function verifyOtp(req, res) {
  let requestorId = req.body.requestorId;
  let otpFromUser = req.body.otp;

  try {
    const otpData = await OtpData.findOne({ requestorId });

    if (otpData === null) {
      console.log("Invalid request");
      res.status(500).json({ message: "Invalid request" });
    } else {
      if (otpData.otps.includes(otpFromUser)) {
        res.status(200).json({ message: "OTP is correct" });
      } else {
        console.log("OTP is incorrect or expired");
        res.status(500).json({ message: "OTP is incorrect or expired" });
      }
    }
  } catch (error) {
    console.log(error)
    console.log("Error in verifying an OTP");
    res.status(500).json({ message: "Error in verifying an OTP" });
  }
}

module.exports = sendOtp;
