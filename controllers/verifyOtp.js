let Otp = require("../models/otpData");


async function verifyOtp(req, res) {

    let requestId = req.body.requestId;
    let otpFromUser = req.body.otp

...

    try {
        const otp = await Otp.findOne({ requestId });
    if (otp !== null ) {
      res
        .status(200)
        .json({ message: "Product fetched successfully", product: product });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
    } catch (error){

    }

  try {
    // Save Otp to database
    const newOtp = new Otp({ requestId, otp });
    await newOtp.save();

    // Send Otp to user
    let send = sendOtp(otp, phoneNumber);

    res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    console.log("Error sending OTP. Error ID: vnzusacca");
    res.status(500).json({ message: "Error sending OTP", error });
  }
}

module.exports = sendOtp;
