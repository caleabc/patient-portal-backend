// Utils
let storage = require("../utils/storage");

// Models
let MedicalRecord = require("../models/medicalRecord");
let Doctor = require("../models/doctor");

async function getPatientsRecords(res, req) {
  let authorizationToken = req.body.authorizationToken;

  let doctorId = storage.get(authorizationToken).doctorId;

  try {
    // Code wrapping ensures the await expression to be fully completed before accessing the response object, (...).clinicId
    let clinicId = (await Secretary.findOne({ id: doctorId })).clinicId;

    let patientsRecords = await MedicalRecord.find({ clinicId });

    res.status(200).json({ patientsRecords });
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

  let doctorId = storage.get(authorizationToken).doctorId;

  try {
    let account = await Doctor.findOne({ doctorId });

    res.status(200).json({ account });
  } catch (error) {
    console.log(error);
    console.log("Error in getting account information");
    res.status(500).json({ message: "Error in getting account information" });
  }
}

module.exports = { getPatientsRecords, account };
