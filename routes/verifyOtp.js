// libraries
const express = require("express");
const router = express.Router();

// controllers
let verifyOtp = require("../controllers/verifyOtp");

router.post("/verify-otp", verifyOtp);

module.exports = router;

