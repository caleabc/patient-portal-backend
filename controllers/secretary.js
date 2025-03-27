// Utils
let storage = require("../utils/storage");
let createId = require("../utils/createId")

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

async function consultation(req, res){
  let {firstname, lastname, age, gender, reasonForConsultation} = req.body

  let authorizationToken = req.body.authorizationToken;

  let secretaryId = storage.get(authorizationToken).secretaryId;

  try {
    // Code wrapping ensures the await expression to be fully completed before accessing the response object, (...).clinicId
    let clinicId = (await Secretary.findOne({ id: secretaryId })).clinicId;

    let newPatient = new Patient({id:createId(), firstname, lastname, age, gender})
    newPatient.save()

    let newMedicalRecord = new MedicalRecord({patientId:createId(), clinicId, })

...

  } catch(error){

    /*

    Since encountered an error, if instance or item is created, then it must be removed
    
    */


    console.log(error);
    console.log("Error in creating consultation record");
    res.status(500).json({ message: "Error in creating consultation record" });
  }

  let newPatient = new Patient({id, firstname, lastname, age, gender})
  newPatient.save()




}

async function newPatient(req, res){
  let id = createId()
  let {firstname, lastname, age, gender} = req.body

  let newPatient = new Patient({id, firstname, lastname, age, gender})
  await newPatient.save()
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
