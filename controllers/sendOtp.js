const OtpData = require("../models/otpData");

const createOtp = require("../utils/createOtp");

async function sendOtp(req, res) {
  /*
  
  Note: A user is only allowed to have 5 OTP per month, reason for this is sms api is currently expensive as of the moment.

  */

  try {
    let number = req.body.phoneNumber;
    const otpData = await OtpData.findOne({ number });

    if (otpData === null) {
      /*

      Send an OTP to a user.

      Uses semaphore sms api
      
      */

      let otp = createOtp();

      let apikey = "c8bc2555b14845065e49b5b095cfc5bd";
      let message = `Your One Time Password is: ${otp}. Please use it within 5 minutes.`;
      let sendername = "Health Record";

      const response = await fetch("https://api.semaphore.co/api/v4/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          apikey: apikey,
          number,
          message,
          sendername: sendername,
        }),
      });

      if (response.ok) {
        /*
      
        Since no error of sending OTP to user then let's now proceed to save OTP to DB.
    
        */
        const newOtpData = new OtpData({ phoneNumber, otps: [otp] });
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

        Uses semaphore sms api
        
        */

        let otp = createOtp();

        let apikey = "c8bc2555b14845065e49b5b095cfc5bd";
        let message = `Your One Time Password is: ${otp}. Please use it within 5 minutes.`;
        let sendername = "Health Record";

        const response = await fetch(
          "https://api.semaphore.co/api/v4/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              apikey: apikey,
              number,
              message,
              sendername: sendername,
            }),
          }
        );

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
