// libraries
const express = require("express");
const router = express.Router();

// controllers
let {account, updateAccount} = require("../controllers/account");

// Middleware
let isAuthorize = require("../middleware/isAuthorized")

router.post("/account", isAuthorize, account);

router.put("/account", isAuthorize, updateAccount);

module.exports = router;
