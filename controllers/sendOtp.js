// Models
const OtpData = require("../models/otpData");
const PhoneNumber = require("../models/phoneNumber")

const createOtp = require("../utils/createOtp");

async function sendOtp(req, res) {

  /*
  
  Note: A user is only allowed to have 5 OTP per month, reason for this is sms api is currently expensive as of the moment.

  */

  try {

    let phoneNumber = req.body.phoneNumber;

    const isPhoneNumberExist = await PhoneNumber.findOne({ phoneNumber });

    if (isPhoneNumberExist === null){
      console.log("Phone number not found")
      
      res.status(500).json({
        message: "Phone number not found",
      });

      // 'return' statement must be here otherwise the code below will still run
      return
    }

    let requestorId = req.body.requestorId;

    const otpData = await OtpData.findOne({ requestorId });

    if (otpData === null) {
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

      // This is a response from PhilSMS api
      let responseStatus = await response.json();
      responseStatus = responseStatus.status

      if (responseStatus === "success") {
        /*
      
        Since no error of sending OTP to user then let's now proceed to saving OTP to DB.
    
        */
        const newOtpData = new OtpData({
          requestorId,
          otps: [{ otp:Number(otp) }],
        });
        await newOtpData.save();

        /*
          
          Respond to a request

        */
        res.status(200).json({ message: "OTP sent." });
      }
    } else {
      let maxAllowedOtpRequestPerMonth = 5;

      if (otpData.otps.length <= maxAllowedOtpRequestPerMonth) {
        
        console.log("User reached the max allowed otp request per month");

        /*
          
          Respond to a request

        */
        res.status(500).json({
          message: "User reached the max allowed otp request per month",
        });
      } else {
        /*
        
        User is still allowed to request an otp

        */

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

        // This is a response from PhilSMS api
        let responseStatus = await response.json();
        responseStatus = responseStatus.status

        if (responseStatus === "success") {
          /*
      
          Since no error of sending OTP to user then let's now proceed to updating the otpData.
  
          */

          let otps = otpData.otps;
          otps.push({ otp:Number(otp) });

          await OtpData.findOneAndUpdate(
            { requestorId: requestorId },
            { otps: otps }
          );

          /*
          
          Respond to a request

          */

          res.status(200).json({ message: "OTP sent." });
        }
      }
    }
  } catch (error) {
    console.log(error);
    console.log("Error sending OTP");
    res.status(500).json({ message: "Error sending OTP", error });
  }
}

module.exports = sendOtp;
