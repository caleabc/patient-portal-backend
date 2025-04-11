// Models
const OtpData = require("../models/otpData");
const PhoneNumber = require("../models/phoneNumber");

// Utils
const createAuthorizationToken = require("../utils/createAuthorizationToken");
const storage = require("../utils/storage");

async function verifyOtp(req, res) {
  let requestorId = req.body.requestorId;
  let phoneNumber = req.body.phoneNumber;
  let otpFromUser = req.body.otp;

  try {
    //Early check
    if (requestorId === undefined || phoneNumber === undefined) {
      console.log("Invalid request");
      res.status(500).json({ message: "Invalid request" });
    }

    const otpData = await OtpData.findOne({ requestorId });

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
        isOtpExist = true;
      }

      // Every otp has only 60 minutes from the time created
      let isOtpNotExpired = false;
      let now = new Date();
      let sixtyMinutes = 60 * 60 * 1000; // 60 minutes in milliseconds
      if (now - createdAt <= sixtyMinutes) {
        isOtpNotExpired = true;
      }

      if (isOtpExist === true && isOtpNotExpired === true) {
        /*
        
        OTP is valid then issue authorization token

        */

        let authorizationToken = createAuthorizationToken();

        let info = await PhoneNumber.findOne({ phoneNumber });

        let data = {
          phoneNumber: info.phoneNumber,
          clinicId: info.clinicId,
          clinicName: info.clinicName,
          firstname: info.firstname,
          lastname: info.lastname,
          role: info.role,
          authorizationToken: authorizationToken,
          createdAt: new Date(),
        };

        /*

        Save authorizationToken to localStorage-like mechanism

        */
        storage.add(authorizationToken, data);

        res.status(200).json(data);
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
