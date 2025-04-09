// Models
const OtpData = require("../models/otpData");
const Secretary = require("../models/secretary");

async function verifyOtp(req, res) {
  let requestorId = req.body.requestorId;
  let phoneNumber = req.body.phoneNumber
  let otpFromUser = req.body.otp;

  try {
    const otpData = await OtpData.findOne({ requestorId });

    /*
    
    TODO:

    Pull up data from AllowedPhoneNumberToRequestOtp model and not Secretary.findOne({ phoneNumber });
    
    */

    // const secretaryData = await Secretary.findOne({ phoneNumber });

    if (otpData === null) {
      console.log("Invalid request");
      res.status(500).json({ message: "Invalid request" });
    } else {
      // Use the latest inserted otp

      let latestInsertedOtp = otpData.otps[otpData.otps.length - 1];
      let createdAt = latestInsertedOtp.createdAt; // This is a Date object
      createdAt = new Date(createdAt).getTime(); // Convert to milliseconds

      let isOtpExist = false;
      if (latestInsertedOtp.otp === Number(otpFromUser)) {
        console.log("aasasasawqwe", [
          latestInsertedOtp.otp,
          Number(otpFromUser),
        ]);
        isOtpExist = true;
      }

      // Every otp has only 30 minutes from the time created
      let isOtpNotExpired = false;
      let now = new Date();
      let thirtyMinutes = 30 * 60 * 1000; // 30 minutes in milliseconds
      if (now - createdAt <= thirtyMinutes) {
        console.log("aasasasawqwe", [now - createdAt, thirtyMinutes]);
        isOtpNotExpired = true;
      }

      if (isOtpExist === true && isOtpNotExpired === true) {
        /*
      
      OTP is valid then issue authorization token

      */
        let authorizationToken = createAuthorizationToken();

        let data = {
          role: "secretary",
          // secretaryId: secretaryData.secretaryId,
          createdAt: new Date(),
        };

        /*

        Save authorizationToken to localStorage-like mechanism

        */
        storage(authorizationToken, data);

        res
          .status(200)
          .json({
            message: "OTP is valid",
            authorizationToken: authorizationToken,
          });
      } else {
        console.log("OTP is incorrect or expired");
        res.status(500).json({ message: "OTP is incorrect or expired" });
      }
    }
  } catch (error) {
    console.log(error);
    console.log("Error in verifying an OTP");
    res.status(500).json({ message: "Error in verifying an OTP" });
  }
}

module.exports = verifyOtp;
