// libraries
const express = require("express");
const router = express.Router();

// Middleware
const isAuthorized = require("../middleware/isAuthorized");

// Controller
let userProfile = require("../controllers/userProfile");

router.get("/user-profile", isAuthorized, userProfile);

module.exports = router;

