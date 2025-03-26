// Utils
let storage = require("../utils/storage");

// Models
let MedicalRecord = require("../models/medicalRecord");
let Patient = require("../models/patient");

async function medicalRecords(res, req) {
  let authorizationToken = req.body.authorizationToken;

  let patientId = storage.get(authorizationToken).patientId;

  try {
    let records = await MedicalRecord.find({ patientId });

    res.status(200).json({ records });
  } catch (error) {
    console.log(error);
    console.log("Error in getting medical records");
    res.status(500).json({ message: "Error in getting medical records" });
  }
}

async function account(req, res) {
  let authorizationToken = req.body.authorizationToken;

  let patientId = storage.get(authorizationToken).patientId;

  try {
    let account = await Patient.findOne({ patientId });

    res.status(200).json({ account });
  } catch (error) {
    console.log(error);
    console.log("Error in getting account information");
    res.status(500).json({ message: "Error in getting account information" });
  }
}

module.exports = { medicalRecords, account };
