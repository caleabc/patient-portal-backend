// Utils
let storage = require("../utils/storage");

// Models
let MedicalRecord = require("../models/medicalRecord");

async function getMedicalRecordsByClinicId(req, res) {
  let authHeader = req.headers.authorization
  let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part

  let info = storage.get(authorizationToken);
  let clinicId = info.clinicId;

  try {
    let patientsRecords = await MedicalRecord.find({ clinicId });

    res.status(200).json(patientsRecords);
  } catch (error) {
    console.log(error);
    console.log("Error in getting patients medical record");
    res
      .status(500)
      .json({ message: "Error in getting patients medical record" });
  }
}

async function getMedicalRecordsByPatientId(req, res) {
  let authHeader = req.headers.authorization
  let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part

  let info = storage.get(authorizationToken);
  let clinicId = info.clinicId;

  try {
    let patientRecords = await MedicalRecord.find({ clinicId });

    res.status(200).json({ patientRecords });
  } catch (error) {
    console.log(error);
    console.log("Error in getting patient medical record");
    res
      .status(500)
      .json({ message: "Error in getting patient medical record" });
  }
}

module.exports = { getMedicalRecordsByClinicId, getMedicalRecordsByPatientId };
