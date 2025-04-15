// Models
const Patient = require("../models/patient");
const MedicalRecord = require("../models/medicalRecord");
const PatientAccessCode = require("../models/patientAccessCode");

// Utils
const createId = require("../utils/createId");
const createAccessCode = require("../utils/createAccessCode")
const storage = require("../utils/storage")

async function consultation(req, res) {
  let {
    reasonForConsultation,
    imgsToBase64String,
    firstname,
    lastname,
    dateOfBirth,
    gender,
    phoneNumber,
  } = req.body;

  let authHeader = req.headers.authorization
  let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part
  let info = storage.get(authorizationToken)

  let clinicId = info.clinicId;

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
      /*
      
      Existing patient

      */

      let newMedicalRecord = new MedicalRecord({
        patientId,
        patientFirstAndLastName: firstname + " " + lastname, // Why this field is here?
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
      /*
      
      New patient

      */

      let id = createId();

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
        patientFirstAndLastName: firstname + " " + lastname, // Why this field is here?
        clinicId,
        reasonForConsultation,
        photos: imgsToBase64String,
      });

      await newMedicalRecord.save();

      if (phoneNumber === undefined) {
        // No phone number provided
        res
          .status(200)
          .json({ message: "Patient consultation successfully saved" });
        return;
      }

      /*
      
      Since no error, send access code to patient, this will be used when logging in.

      Send an OTP to a user.

      Uses PhilSMS api

      */

      let accessCode = createAccessCode();

      const url = "https://app.philsms.com/api/v3/sms/send";
      const apiToken = process.env.PHILSMS_API_TOKEN;
      const senderId = process.env.PHILSMS_SENDER_ID;

      const payload = {
        recipient: phoneNumber,
        sender_id: senderId,
        type: "plain",
        message: `Your access code is: ${accessCode}. You can use it to login in health record.`,
      };

      const response = await fetch(url, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${apiToken}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },

        body: JSON.stringify(payload),
      });

      /*
      
      Regardless of response status of PhilSMS we still need to save the access code to DB
      
      */
      let newPatientAccessCode = new PatientAccessCode({
        accessCode: accessCode,
        patientId: id
      });

      await newPatientAccessCode.save();

      res.status(200).json({ message: "Patient consultation successfully saved" })
      
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
