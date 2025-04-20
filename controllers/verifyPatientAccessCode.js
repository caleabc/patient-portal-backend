
// Model
const PatientAccessCode = require("../models/patientAccessCode");
const AuthorizationData = require("../models/authorizationData")

// Utils
let createAuthorizationToken = require("../utils/createAuthorizationToken")

async function verifyPatientAccessCode(req, res) {
  try {
    
    const response = await PatientAccessCode.findOne({ accessCode: req.body.patientAccessCode});

    if (response === null) {
      console.log("Patient access code is not found");
      res.status(401).json({ message: "Patient access code is not found" });
    } else {

      /*
      
      Patient access code is correct then issue authorization token

      */

      let patientId = response.patientId
      
      let authorizationToken = createAuthorizationToken()

      let role = "patient"

      let newAuthorizationData = new AuthorizationData({authorizationToken, role, id:patientId}) // If role is patient then this "id" is pointing to patient schema "id" field, if role is secretary then this "id" is pointing to secretary schema "id" field, if role is doctor then this "id" is pointing to doctor schema "id" field

      await newAuthorizationData.save()

      res.status(200).json({authorizationToken, role, id:patientId });
    }
  } catch (error) {
    console.log(error)
    console.log("Error in verifying patient access code");
    res.status(500).json({ message: "Error in verifying patient access code" });
  }
}

module.exports = verifyPatientAccessCode;
