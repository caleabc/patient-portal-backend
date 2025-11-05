// Lib
const jwt = require('jsonwebtoken');

// Models
const OtpObject = require("../models/otpObject");
const PhoneNumber = require("../models/phoneNumber");
const Secretary = require("../models/secretary");
const Doctor = require("../models/doctor");
const AuthorizationData = require("../models/authorizationData");

// Utils
const createAuthorizationToken = require("../utils/createAuthorizationToken");
const createId = require("../utils/createId");

async function verifyOtp(req, res) {
  let requestorId = req.body.requestorId;
  let otpFromUser = req.body.otp;

  try {
    //Early check
    if (requestorId === undefined || otpFromUser === undefined) {
      console.log("Bad request");
      res.status(400).json({ message: "Bad request" });

      return;
    }

    const otpObject = await OtpObject.findOne({ requestorId: requestorId });

    if (otpObject === null) {
      console.log("Requestor id not found");
      res.status(400).json({ message: "Requestor id not found" });

      return;
    }

    const userId = otpObject.userId;
    const role = otpObject.role;

    if (otpObject.otp === otpFromUser) {
      // on this part otp object is valid

      // get user information
      let userInformation = undefined;

      if (role === "Patient") {
        userInformation = await Patient.findOne({ id: userId });
      }

      if (role === "Secretary") {
        userInformation = await Secretary.findOne({ id: userId });
      }

      if (role === "Doctor") {
        userInformation = await Doctor.findOne({ id: userId });
      }

      // we need to remove the saved otp object now since the otp object is a one-time use only
      await OtpObject.findOneAndDelete({ requestorId: requestorId });

      const payload = { role:role, userId: userId };
      const jwtSecretKey = process.env.JWT_SECRET_KEY;
      
      let authorizationToken = jwt.sign(payload, jwtSecretKey);

      // calculation for approximately 1 month (30 days)
      const oneMonthInMilliseconds = 1000 * 60 * 60 * 24 * 30;

      res.cookie("authorizationToken", authorizationToken, {
        httpOnly: true, // not accessible by JavaScript
        // secure: true, // HTTPS only
        secure: process.env.NODE_ENV === 'production', // false in development
        sameSite: "Strict", // only sent for same-site requests
        maxAge: oneMonthInMilliseconds,
      });

      res.status(200).json({...userInformation, role:role});
    } else {
      res.status(400).json({ message: "Incorrect OTP" });
    }
  } catch (error) {
    console.log(error);
    console.log("Error in verifying an OTP");
    res.status(500).json({ message: "Error in verifying an OTP" });
  }
}

module.exports = verifyOtp;

