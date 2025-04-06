// libraries
const express = require("express");
const router = express.Router();

// controllers
let sendOtp = require("../controllers/sendOtp");

router.post("/send-otp", sendOtp);

module.exports = router;

