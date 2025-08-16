// libraries
const express = require("express");
const router = express.Router();

// controllers
let consultation = require("../controllers/consultation");

// Middleware
const isAuthorizedInConsultation = require("../middleware/isAuthorizedInConsultation")
const validateAndSanitizeInputsForConsultation = require("../middleware/validateAndSanitizeInputsForConsultation")

router.post("/consultation", isAuthorizedInConsultation, validateAndSanitizeInputsForConsultation, consultation);

module.exports = router;
