// libraries
const express = require("express");
const router = express.Router();

// controllers
let verifyPatientAccessCode = require("../controllers/verifyPatientAccessCode");

router.post("/verify-patient-access-code", verifyPatientAccessCode);

module.exports = router;


