// Models
const OtpData = require("../models/otpData");
const PhoneNumber = require("../models/phoneNumber");
const Secretary = require("../models/secretary")
const Doctor = require("../models/doctor")
const AuthorizationData = require("../models/authorizationData")

// Utils
const createAuthorizationToken = require("../utils/createAuthorizationToken");
const createId = require("../utils/createId")

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
      /*
      
      Use the latest inserted otp

      */

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

        let role = info.role

        let clinicId = info.clinicId

        let id = createId()

        /*
        
        A secretary or a doctor on their first sending and verifying of OTP they don't have a record on user information (secretary schema or doctor schema) but when it's their second time then that's the time they already had a record
        
        */
        if (role === "secretary") {
          let userInformation = await Secretary.findOne({ phoneNumber });

          if (userInformation === null){
            // On this part, it's their first time

            let newSecretary = new Secretary({id, clinicId, phoneNumber});
            await newSecretary.save()
          } else {
            // On this part it's on their second time, they already had a record

            // This is important you need to update the "id" above since they already have the "id", that "id" will be sent to frontend / client
            id = userInformation.id
          }
        }

        if (role === "doctor") {
          let userInformation = await Doctor.findOne({ phoneNumber });

          if (userInformation === null){
            // On this part, it's their first time

            let newDoctor = new Doctor({id, clinicId, phoneNumber});
            await newDoctor.save()
          } else {
            // On this part it's on their second time, they already had a record

            // This is important you need to update the "id" above since they already have the "id", that "id" will be sent to frontend / client
            id = userInformation.id
          }
        }

        let newAuthorizationData = new AuthorizationData({authorizationToken, role, id}) // If role is patient then this "id" is pointing to patient schema "id" field, if role is secretary then this "id" is pointing to secretary schema "id" field, if role is doctor then this "id" is pointing to doctor schema "id" field
        
        await newAuthorizationData.save()

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
