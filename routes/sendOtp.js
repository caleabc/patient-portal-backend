// libraries
const express = require("express");
const router = express.Router();

// controllers
const sendOtp = require("../controllers/sendOtp");

// middleware
const sendOtpLimiter = require("../middleware/sendOtpLimiter")

router.post("/send-otp", sendOtpLimiter, sendOtp);

module.exports = router;

