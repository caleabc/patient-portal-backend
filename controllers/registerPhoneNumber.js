// Models
let PhoneNumber = require("../models/phoneNumber");

async function registerPhoneNumber(req, res) {

  console.log("hello rgphonenumber")

  console.log(req.body)

  let { phoneNumber, role, id, clinicId } = req.body;

  try {
    const newPhoneNumber = new PhoneNumber({
      phoneNumber,
      role, // secretary or doctor
      id, // If role is secretary then this "id" is pointing to secretary schema "id" field, if role is doctor then this "id" is pointing to doctor schema "id" field
      clinicId
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

module.exports = registerPhoneNumber;
