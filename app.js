// Lib
const express = require( "express")
const rateLimit = require('express-rate-limit');
const dotenv = require("dotenv")
dotenv.config(); // Load .env file

// Create an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

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

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
})


