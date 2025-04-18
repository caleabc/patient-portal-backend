// libraries
const express = require("express");
const router = express.Router();

// controllers
let { getMedicalRecordsByClinicId, getMedicalRecordById, getMedicalRecordsBySearchQuery } = require("../controllers/medicalRecords");

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

module.exports = router;
