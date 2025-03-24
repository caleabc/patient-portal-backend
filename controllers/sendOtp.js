const OtpData = require("../models/otpData");

const createOtp = require("../utils/createOtp");
const sendOtpToUser = require("../utils/sendOtpToUser")

async function sendOtp(req, res) {
  /*
  --------
  Scenario
  --------
  Mike can request upto 20 Otp per day, reason for this is, rate limiting helps prevent from abusing an API or endpoint by sending a large number of requests in a short period
  */

  let otp = createOtp();
  let requestId = req.body.requestId;

  try {
    const otpData = await OtpData.findOne({ requestId });

    if (otpData === null) {
      // Save Otp to database
      const newOtpData = new Otp({ requestId, otps: [otp] });
      await newOtpData.save();
    } else {
      let maxAllowedOtpRequestPerDay = 20;

      if (otpData.otps.length > maxAllowedOtpRequestPerDay) {
        console.log("User reached the max allowed otp request per day");
        res
          .status(500)
          .json({
            message: "User reached the max allowed otp request per day",
          });
      } else {
        // User is still allowed to request an otp

        let otps = otpData.otps;
        otps.push(otp);

        await OtpData.findOneAndUpdate(
          { requestId: requestId },
          { otps: otps }
        );
      }
    }

    /*

    Send Otp to user
    
    */
    let phoneNumber = req.body.phoneNumber;
    await sendOtpToUser(otp, phoneNumber);

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.log("Error sending OTP. Error ID: vnzusacca");
    res.status(500).json({ message: "Error sending OTP", error });
  }
}

module.exports = sendOtp;
