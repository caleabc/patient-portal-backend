// Utils
let storage = require("../utils/storage");

// Models
let MedicalRecord = require("../models/medicalRecord");
let Secretary = require("../models/secretary");

async function getPatientsRecords(res, req) {
  let authorizationToken = req.body.authorizationToken;

  let secretaryId = storage.get(authorizationToken).secretaryId;

  try {
    // Code wrapping ensures the await expression to be fully completed before accessing the response object, (...).clinicId
    let clinicId = (await Secretary.findOne({ id: secretaryId })).clinicId;

    let patientsRecords = await MedicalRecord.find({ clinicId });

    /*

    TODO:

    Does the secretary able to view patient full medical record including the sensitive information of a patient?

    */

    res.status(200).json({ todo: "todo" });
  } catch (error) {
    console.log(error);
    console.log("Error in getting patients medical record");
    res
      .status(500)
      .json({ message: "Error in getting patients medical record" });
  }
}

async function account(req, res) {
  let authorizationToken = req.body.authorizationToken;

  let secretaryId = storage.get(authorizationToken).secretaryId;

  try {
    let account = await Secretary.findOne({ secretaryId });

    res.status(200).json({ account });
  } catch (error) {
    console.log(error);
    console.log("Error in getting account information");
    res.status(500).json({ message: "Error in getting account information" });
  }
}

module.exports = { getPatientsRecords, account };
