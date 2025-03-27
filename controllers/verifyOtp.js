
// Models
const OtpData = require("../models/otpData");
const Secretary = require("../models/secretary")

async function verifyOtp(req, res) {
  let requestorId = req.body.requestorId;
  let otpFromUser = req.body.otp;
  let phoneNumber = req.body.phoneNumber;

  try {
    const otpData = await OtpData.findOne({ phoneNumber });
    const secretaryData = await Secretary.findOne({phoneNumber})

    if (otpData === null) {
      console.log("Invalid request");
      res.status(500).json({ message: "Invalid request" });
    } else {
      if (otpData.otps.includes(otpFromUser)) {

      /*
      
      OTP is correct then issue authorization token

      */
      
      let authorizationToken = createAuthorizationToken()

      let data = {role:'secretary', secretaryId:secretaryData.secretaryId, createdAt:new Date()}

      /*

      Save authorizationToken to localStorage-like mechanism

      */
      storage(authorizationToken, data)

      res.status(200).json({ message: "OTP is correct", authorizationToken: authorizationToken });
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
