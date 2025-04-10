// Models
let PhoneNumber = require("../models/phoneNumber");

async function registerPhoneNumber(res, req) {
  let { phoneNumber, clinicId, clinicName, firstname, lastname, role } =
    req.body;

  try {
    const newPhoneNumber = new PhoneNumber({
      phoneNumber,
      clinicId,
      clinicName,
      firstname,
      lastname,
      role,
    });
    await newPhoneNumber.save();

    /*
        
        Respond to a request

    */
    res.status(200).json({ message: "Phone number successfully registered." });
  } catch (error) {
    console.log(error);
    console.log("Error in registering phone number");
    res.status(500).json({ message: "Error in registering phone number" });
  }
}

module.exports = { registerPhoneNumber };
