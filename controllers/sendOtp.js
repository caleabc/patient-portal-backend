const createOtp = require("../utils/createOtp")

function sendOtp(req, res) {
    let otp = createOtp()

    // ...
}

module.exports = sendOtp;

