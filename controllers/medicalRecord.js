// Models
let MedicalRecord = require("../models/medicalRecord");
let Patient = require("../models/patient");
let AuthorizationData = require("../models/authorizationData");
let Secretary = require("../models/secretary");
let Doctor = require("../models/doctor");

async function getMedicalRecordsByClinicId(req, res) {
  let authHeader = req.headers.authorization;
  let authorizationToken = authHeader && authHeader.split(" ")[1]; // Gets just the token part

  let clinicId;

  try {
    let authorizationData = await AuthorizationData.findOne({
      authorizationToken,
    });
    let role = authorizationData.role;
    let id = authorizationData.id;

    if (role === "secretary") {
      let secInformation = await Secretary.findOne({ id });

      clinicId = secInformation.clinicId;
    }

    if (role === "doctor") {
      let docInformation = await Doctor.findOne({ id });

      clinicId = docInformation.clinicId;
    }

    let patientsRecords = await MedicalRecord.find({ clinicId })
      .select("-photos")
      .sort({ createdAt: -1 })
      .limit(50);

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
  // This is the medical record id
  const { id } = req.params;

  let authHeader = req.headers.authorization
  let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part

  let authorizationData = await AuthorizationData.findOne({authorizationToken})
  let doctorId = authorizationData.id

  try {
    let medicalRecord = await MedicalRecord.findOne({ id }).select("-photos");

    let patientId = medicalRecord.patientId;
    let patientInformation = await Patient.findOne({ id: patientId });
    patientInformation = patientInformation.decrypt();

    let doctorInformation = await Doctor.findOne({id:doctorId})

    res.status(200).json({ medicalRecord, doctorInformation, patientInformation });
  } catch (error) {
    console.log(error);
    console.log("Error in getting patient medical record");
    res
      .status(500)
      .json({ message: "Error in getting patient medical record" });
  }
}

async function getMedicalRecordWithPhotosById(req, res) {
  const { id } = req.params;

  try {
    let medicalRecord = await MedicalRecord.findOne({ id });

    res.status(200).json(medicalRecord);
  } catch (error) {
    console.log(error);
    console.log("Error in getting patient medical record");
    res
      .status(500)
      .json({ message: "Error in getting patient medical record" });
  }
}

async function getMedicalRecordsByPatientId(req, res) {
  let { patientId } = req.body;

  try {
    let medicalRecords = await MedicalRecord.find({ patientId });

    res.status(200).json(medicalRecords);
  } catch (error) {
    console.log(error);
    console.log("Error in getting patient medical record");
    res
      .status(500)
      .json({ message: "Error in getting patient medical record" });
  }
}

async function getMedicalRecordsByPatientIdBySearchQuery(req, res) {
  let { patientId, query } = req.body;

  try {
    let patientRecords = await MedicalRecord.find({
      patientId: patientId,
      reasonForConsultation: { $regex: query, $options: "i" },
    })
      .select("-photos")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(patientRecords);
  } catch (error) {
    console.log(error);
    console.log("Error in getting patient medical record");
    res
      .status(500)
      .json({ message: "Error in getting patient medical record" });
  }
}

async function getMedicalRecordsBySearchQuery(req, res) {
  let authHeader = req.headers.authorization;
  let authorizationToken = authHeader && authHeader.split(" ")[1]; // Gets just the token part

  let clinicId;

  let query = req.query.q;

  try {
    let authorizationData = await AuthorizationData.findOne({
      authorizationToken,
    });
    let role = authorizationData.role;
    let id = authorizationData.id;

    if (role === "secretary") {
      let secInformation = await Secretary.findOne({ id });

      clinicId = secInformation.clinicId;
    }

    if (role === "doctor") {
      let docInformation = await Doctor.findOne({ id });

      clinicId = docInformation.clinicId;
    }

    let patientsRecords = await MedicalRecord.find({
      clinicId: clinicId,
      patientFirstAndLastName: { $regex: query, $options: "i" },
    })
      .select("-photos")
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json(patientsRecords);
  } catch (error) {
    console.log(error);
    console.log("Error in getting patients medical record");
    res
      .status(500)
      .json({ message: "Error in getting patients medical record" });
  }
}

async function updateMedicalRecordById(req, res) {
  let authHeader = req.headers.authorization;
  let authorizationToken = authHeader && authHeader.split(" ")[1]; // Gets just the token part

  const { id } = req.params;

  try {
    /*
    
    This update is only for photos section (imgsToBase64String), the reason why it is design this way is because when submitting the consultation information because of the size of files (basically photos) it takes a bit long and that's make the submission a bit slow, so the work around is send the medical consultation information without the photos (imgsToBase64String) then do a second request, send the photos and this time we will no longer wait basically do this in the background

    */

    let imgToBase64String = req.body.imgToBase64String;

    if (imgToBase64String !== undefined) {
      try {
        await MedicalRecord.findOneAndUpdate(
          { id: id },
          { $push: { photos: imgToBase64String } }
        );

        res
          .status(200)
          .json({ message: "Photo converted to base64String saved" });
      } catch (error) {
        console.log("thgthgvbnmnbvbn");
        console.log(error);
      }

      return;
    }

    let authorizationData = await AuthorizationData.findOne({
      authorizationToken,
    });

    let role = authorizationData.role;

    /*
  
    Only the doctor can update the diagnosis, remarks, lab request and prescription sections of medical record

    */
    if (role !== "doctor") {
      console.log("Unauthorized");
      res.status(500).json({ message: "Unauthorized" });

      return;
    }

    let { diagnosis, remarks, labRequest, prescription } = req.body;

    if (diagnosis !== undefined) {
      await MedicalRecord.findOneAndUpdate({ id }, { diagnosis });
      res.status(200).json("Medical diagnosis successfully saved");
      return;
    }

    if (remarks !== undefined) {
      await MedicalRecord.findOneAndUpdate({ id }, { remarks });
      res.status(200).json("Medical remarks successfully saved");
      return;
    }

    if (labRequest !== undefined) {
      MedicalRecord.findOneAndUpdate(
        { id },
        { $push: { labRequests: labRequest } }
      );
      res.status(200).json("Medical lab request successfully saved");
      return;
    }

    if (prescription !== undefined) {
      await MedicalRecord.findOneAndUpdate(
        { id },
        { $push: { prescriptions: prescription } }
      );
      res.status(200).json("Medical prescription successfully saved");
      return;
    }
  } catch (error) {
    console.log(error);
    console.log("Error in updating patient medical record");
    res
      .status(500)
      .json({ message: "Error in updating patient medical record" });
  }
}

module.exports = {
  getMedicalRecordsByClinicId,
  getMedicalRecordById,
  getMedicalRecordWithPhotosById,
  getMedicalRecordsByPatientId,
  getMedicalRecordsByPatientIdBySearchQuery,
  getMedicalRecordsBySearchQuery,
  updateMedicalRecordById,
};
