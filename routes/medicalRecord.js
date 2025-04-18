// libraries
const express = require("express");
const router = express.Router();

// controllers
let { getMedicalRecordsByClinicId, getMedicalRecordById, getMedicalRecordsBySearchQuery, updateMedicalRecordById } = require("../controllers/medicalRecord");

// Middleware
const isAuthorized = require("../middleware/isAuthorized");

router.get(
  "/medical-records-by-clinic-id",
  isAuthorized,
  getMedicalRecordsByClinicId
);

router.get(
  "/medical-record/:id",
  isAuthorized,
  getMedicalRecordById
);

router.get(
  "/medical-records-by-search-query",
  isAuthorized,
  getMedicalRecordsBySearchQuery
);

/*

Only the doctor can update the medical record

*/
router.put(
  "/medical-record/:id",
  isAuthorized,
  updateMedicalRecordById
);

module.exports = router;
