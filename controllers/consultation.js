// Models
const Patient = require("../models/patient");
const MedicalRecord = require("../models/medicalRecord");
const PatientAccessCode = require("../models/patientAccessCode");
const AuthorizationData = require("../models/authorizationData")
const Secretary = require("../models/secretary")
const Doctor = require("../models/doctor")

// Utils
const createId = require("../utils/createId");
const createAccessCode = require("../utils/createAccessCode");
const hash = require("../utils/hash")

async function consultation(req, res) {

  let {
    reasonForConsultation,
    firstname,
    lastname,
    dateOfBirth,
    gender,
    phoneNumber,
  } = req.body;

  let authHeader = req.headers.authorization;
  let authorizationToken = authHeader && authHeader.split(" ")[1]; // Gets just the token part

  let medicalRecordId = createId()

  let clinicId;

  let hashedLastnameSecret = process.env.HASHED_LASTNAME_SECRET;

  let hashedLastname = hash(lastname + hashedLastnameSecret)

  try {
    let authorizationData = await AuthorizationData.findOne({authorizationToken})
    let role = authorizationData.role
    let id = authorizationData.id

    if (role === "secretary"){
      let secInformation = await Secretary.findOne({id})

      clinicId = secInformation.clinicId
    }

    if (role === "doctor"){
      let docInformation = await Doctor.findOne({id})

      clinicId = docInformation.clinicId
    }

    let patients = await Patient.find({ hashedLastname });

    let isCurrentPatientExisting = false;
    let patientId = null;

    for (let i = 0; i < patients.length; i++) {
      let patient = patients[i];

      // Decrypt
      patient = patient.decrypt();

      if (
        patient["lastname"] === lastname.toLowerCase() &&
        patient["firstname"] === firstname.toLowerCase() &&
        patient["dateOfBirth"] === dateOfBirth
      ) {
        isCurrentPatientExisting = true;
        patientId = patient.id;

        break;
      }
    }

    if (isCurrentPatientExisting === true) {
      /*
      
      Existing patient

      */

     console.log({isCurrentPatientExisting})

      let newMedicalRecord = new MedicalRecord({
        id: medicalRecordId,
        patientId,
        patientFirstAndLastName:
          firstname.toLowerCase() + " " + lastname.toLowerCase(), // Why this field is here?
        clinicId,
        reasonForConsultation,
        diagnosis: "",
        remarks: ""
      });

      await newMedicalRecord.save();

      /*
          
          Respond to a request

      */
      res
        .status(200)
        .json({medicalRecordId:medicalRecordId, message: "Patient consultation successfully saved" });
    } else {
      /*
      
      New patient

      */

      console.log({isCurrentPatientExisting})

      // There is already patientId variable above so we will just update the value of it.
      patientId = createId();

      let newPatient = new Patient({
        id: patientId,
        firstname: firstname.toLowerCase(),
        lastname: lastname.toLowerCase(),
        hashedLastname,
        dateOfBirth,
        gender,
        phoneNumber: phoneNumber,
      });

      await newPatient.save();

      /*
    
      Save patient consultation
    
      */
      let newMedicalRecord = new MedicalRecord({
        id: medicalRecordId,
        patientId: patientId,
        patientFirstAndLastName:
          firstname.toLowerCase() + " " + lastname.toLowerCase(), // Why this field is here?
        clinicId,
        reasonForConsultation,
        diagnosis: "",
        remarks: "",
      });

      await newMedicalRecord.save();

      let accessCode = createAccessCode();

      if (phoneNumber === "+63") {
        // No phone number provided
        res.status(200).json({medicalRecordId, message: "Patient consultation successfully saved" });
        
        let newPatientAccessCode = new PatientAccessCode({
          accessCode: accessCode,
          patientId: patientId,
        });
  
        // Save the access code to DB
        newPatientAccessCode.save();

        return;
      }

      /*
      
      Since no error, send access code to patient, this will be used when logging in.

      Send an OTP to a user.

      Uses PhilSMS api

      */

      const url = "https://app.philsms.com/api/v3/sms/send";
      const apiToken = process.env.PHILSMS_API_TOKEN;
      const senderId = process.env.PHILSMS_SENDER_ID;

      const payload = {
        recipient: phoneNumber,
        sender_id: senderId,
        type: "plain",
        message: `Your access code is: ${accessCode}. You can use it to login.`,
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
        patientId: patientId,
      });

      await newPatientAccessCode.save();

      res
        .status(200)
        .json({medicalRecordId, message: "Patient consultation successfully saved" });
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
