// libraries
const express = require("express");
const router = express.Router();

// controllers
let registerPhoneNumber = require("../controllers/registerPhoneNumber");

router.post("/register-phone-number", registerPhoneNumber);

module.exports = router;

