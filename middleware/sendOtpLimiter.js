const rateLimit = require('express-rate-limit');

const sendOtpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // Limit each IP to 5 requests per `windowMs` (hour)
  message: "You have exceeded the 5 requests per hour limit. Please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
})

module.exports = sendOtpLimiter

