// libraries
const express = require("express");
const router = express.Router();

// controllers
let consultation = require("../controllers/consultation");

// Middleware
const {validateConsultation, checkValidationResult } = require("../middleware/inputsSanitizationForConsultation")
const validateAndSanitizeInputsForConsultation = require("../middleware/validateAndSanitizeInputsForConsultation")

router.post("/consultation", validateAndSanitizeInputsForConsultation, consultation);

module.exports = router;
