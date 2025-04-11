// Models
const Patient = require("../models/patient");
const MedicalRecord = require("../models/medicalRecord");

// Utils
const createId = require("../utils/createId");

async function consultation(req, res) {
  let reasonForConsultation = req.body.updatedInputsData.reasonForConsultation; // string, "headache"
  let imgsToBase64String = req.body.updatedInputsData.imgsToBase64String; // array of base64string, ["data:image/png;base64,iVBORw0KGgoAAAA"]
  let firstname = req.body.updatedInputsData.firstname; // string
  let lastname = req.body.updatedInputsData.lastname; // string
  let dateOfBirth = req.body.updatedInputsData.dateOfBirth; // string
  let gender = req.body.updatedInputsData.gender; // string
  let phoneNumber = req.body.updatedInputsData.phoneNumber; // string

  let clinicId = req.body.clinicId;

  let patientInformation = {
    patientId: createId(),
    firstname,
    lastname,
    dateOfBirth,
    gender,
    phoneNumber,
  };

  try {
    let patients = Patient.find({ lastname });

    let isCurrentPatientExisting = false;
    let patientId = null;

    for (let i = 0; i < patients.length; i++) {
      let patient = patients[i];

      if (
        patient["lastname"] === lastname &&
        patient["firstname"] === firstname &&
        patient["dateOfBirth"] === dateOfBirth
      ) {
        isCurrentPatientExisting = true;
        patientId = patient.patientId;

        break;
      }
    }

    if (isCurrentPatientExisting === true) {
      // Existing patient
      let newMedicalRecord = new MedicalRecord({
        patientId,
        clinicId,
        reasonForConsultation,
        photos: imgsToBase64String,
      });

      await newMedicalRecord.save();

      /*
          
          Respond to a request

      */
      res
        .status(200)
        .json({ message: "Patient consultation successfully saved" });
    } else {
      // New patient

      let id = createId();

      /*
    
      Save patient information

      */
      let newPatient = new Patient({
        id,
        firstname,
        lastname,
        dateOfBirth,
        gender,
        mobile: phoneNumber,
      });

      await newPatient.save();

      /*
    
      Save patient consultation
    
      */
      let newMedicalRecord = new MedicalRecord({
        patientId: id,
        clinicId,
        reasonForConsultation,
        photos: imgsToBase64String,
      });

      await newMedicalRecord.save();

      /*
          
          Respond to a request

      */

      res
        .status(200)
        .json({ message: "Patient consultation successfully saved" });
    }
  } catch (error) {
    console.log(error);
    console.log("Error in saving consultation information");
    res
      .status(500)
      .json({ message: "Error in saving consultation information" });
  }
}

module.exports = consultation;
