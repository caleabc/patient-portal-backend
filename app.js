// Lib
const express = require("express")
const rateLimit = require('express-rate-limit');
const cors = require('cors')
const dotenv = require("dotenv")
dotenv.config(); // Load .env file

// Routes
const sendOtp = require("./routes/sendOtp");
const verifyOtp = require("./routes/verifyOtp")
const verifyPatientAccessCode = require("./routes/verifyPatientAccessCode")
const consultation = require("./routes/consultation")
const registerPhoneNumber = require("./routes/registerPhoneNumber")
const medicalRecord = require("./routes/medicalRecord")
const account = require("./routes/account")

// Create an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json({ limit: '50mb' })); // Request body size

// Allow access to ...
app.use(cors())

// To prevent our backend (server) from abuse, added request limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiter to all requests
app.use(limiter);

// Database configuration
const dbConfiguration = require("./databaseConfiguration")
// Run DB
dbConfiguration()

// Use routes
app.use(sendOtp)
app.use(verifyOtp)
app.use(verifyPatientAccessCode)
app.use(consultation)
app.use(registerPhoneNumber)
app.use(medicalRecord)
app.use(account)

const port = 5000;
app.listen(port, function (){
  console.log("Server is now running...");
})


