// Utils
let storage = require("../utils/storage");

// Models
let MedicalRecord = require("../models/medicalRecord");
let Patient = require("../models/patient")

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

async function getMedicalRecordById(req, res) {

  const { id } = req.params;

  try {
    let medicalRecord = await MedicalRecord.findOne({ id });

    let patientId = medicalRecord.patientId
    let patientInformation = await Patient.findOne({ id:patientId });

    res.status(200).json({medicalRecord, patientInformation});
  } catch (error) {
    console.log(error);
    console.log("Error in getting patient medical record");
    res
      .status(500)
      .json({ message: "Error in getting patient medical record" });
  }
}

module.exports = { getMedicalRecordsByClinicId, getMedicalRecordById };
