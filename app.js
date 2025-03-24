// Lib
const express = require( "express")
const dotenv = require("dotenv")
dotenv.config(); // Load .env file

// Create an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// test 101 --------------------------------------------
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 60 minutes
  max: 100, // Limit each IP to 100 requests per windowMs, in this case 60 minutes
});

// Apply the rate limiting middleware to all requests
app.use(limiter);
// test 101 ----------------------------------------------------

// Database configuration
const dbConfiguration = require("./databaseConfiguration")
// Run DB
dbConfiguration()

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
})


