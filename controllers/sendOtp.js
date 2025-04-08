const OtpData = require("../models/otpData");

const createOtp = require("../utils/createOtp");

async function sendOtp(req, res) {
  
  /*
  
  TODO:
  Verify first if the phone number is allowed to request for an OTP

  */

  /*
  
  Note: A user is only allowed to have 5 OTP per month, reason for this is sms api is currently expensive as of the moment.

  */

  try {
    let requestorId = req.body.requestorId;
    let phoneNumber = req.body.phoneNumber;

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
        recipient: "639563458792", // Replace with the data you want to send
        sender_id: senderId,
        type: "plain",
        message: `Your One Time Password is: ${otp}. Please use it within 30 minutes.`,
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

      if (response.ok) {
        /*
      
        Since no error of sending OTP to user then let's now proceed to saving OTP to DB.
    
        */
        const newOtpData = new OtpData({
          requestorId,
          phoneNumber,
          otps: [otp],
        });
        await newOtpData.save();

        /*
          
          Respond to a request

        */

        res.status(200).json({ message: "OTP sent." });
      }
    } else {
      let maxAllowedOtpRequestPerMonth = 5;

      if (otpData.otps.length > maxAllowedOtpRequestPerMonth) {
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
          recipient: "639563458792", // Replace with the data you want to send
          sender_id: senderId,
          type: "plain",
          message: `Your One Time Password is: ${otp}. Please use it within 30 minutes.`,
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

        if (response.ok) {
          /*
      
          Since no error of sending OTP to user then let's now proceed to updating the otpData.
  
          */

          let otps = otpData.otps;
          otps.push(otp);

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
