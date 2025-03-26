
// Model
const PatientAccessCode = require("../models/otpData");

// Utils
let createAuthorizationToken = require("../utils/createAuthorizationToken")
let storage = require("../utils/storage")

async function verifyPatientAccessCode(req, res) {
  try {
    const response = await PatientAccessCode.findOne({ code: req.body.patientAccessCode});

    if (response === null) {
      console.log("Patient access code is not found");
      res.status(401).json({ message: "Patient access code is not found" });
    } else {

      /*
      
      Patient access code is correct then issue authorization token

      */
      
      let authorizationToken = createAuthorizationToken()

      let data = {role:'patient', patientId:response.patientId, createdAt:new Date()}

      /*

      Save authorizationToken to localStorage-like mechanism

      */
      storage(authorizationToken, data)

      res.status(200).json({ message: "Patient access code is correct", authorizationToken: authorizationToken });
    }
  } catch (error) {
    console.log(error)
    console.log("Error in verifying patient access code");
    res.status(500).json({ message: "Error in verifying patient access code" });
  }
}

module.exports = verifyPatientAccessCode;
