// Models
const OtpObject = require("../models/otpObject");
const PhoneNumber = require("../models/phoneNumber");
const createId = require("../utils/createId");
const createOtp = require("../utils/createOtp");

async function sendOtp(req, res) {
  try {
    const phoneNumber = req.body.phoneNumber;

    const phoneNumberObject = await PhoneNumber.findOne({ phoneNumber:phoneNumber });

    if (phoneNumberObject === null) {
      console.log("Phone number not found");

      res.status(500).json({
        message: "Phone number not found",
      });

      // 'return' statement must be here otherwise the code below will still run
      return;
    }

    const userId = phoneNumberObject.userId
    const role = req.body.role

    /*

    Send an OTP to a user.

    Uses PhilSMS api
    
    */
    let otp = createOtp();

    const url = "https://app.philsms.com/api/v3/sms/send";
    const apiToken = process.env.PHILSMS_API_TOKEN;
    const senderId = process.env.PHILSMS_SENDER_ID;

    const payload = {
      recipient: phoneNumber,
      sender_id: senderId,
      type: "plain",
      message: `Your One Time Password is: ${otp}. Please use it within 60 minutes.`,
    };

    const response = await fetch(url, {
      method: "POST",

      headers: {
        Authorization: `Bearer ${apiToken}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },

      body: JSON.stringify(payload),
    });

    // This is a parsed response from PhilSMS api
    let obj = await response.json();
    let status = obj.status;

    if (status === "success") {
      /*
      
        Since no error of sending OTP to user then let's now proceed to saving OTP to DB.
    
        */

      const requestorId = createId();

      // TODO:
      // - add userId on newOtpObject

      const newOtpObject = new OtpObject({
        requestorId: requestorId,
        otp: otp,
        userId: userId,
        role:role
      });

      await newOtpObject.save();

      // otpObject is successfully saved

      // respond to user with a requestor ID

      res.status(200).json({ requestorId: requestorId });
    } else {
      // There's an error on PhilSMS api
      res.status(500).json({ error: "There's an error on PhilSMS api" });
    }
  } catch (error) {
    console.log(error);
    console.log("Error sending OTP");
    res.status(500).json({ message: "Error sending OTP", error });
  }
}

module.exports = sendOtp;

