// libraries
const express = require("express");
const router = express.Router();

// controllers
let { getMedicalRecordsByClinicId } = require("../controllers/medicalRecords");

// Middleware
const isAuthorized = require("../middleware/isAuthorized");

router.get(
  "/medical-records-by-clinic-id",
  isAuthorized,
  getMedicalRecordsByClinicId
);

module.exports = router;
