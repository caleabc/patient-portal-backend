// Lib
const express = require( "express")
const dotenv = require("dotenv")
dotenv.config(); // Load .env file

// Create an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Database configuration
const dbConfiguration = require("./databaseConfiguration")
// Run DB
dbConfiguration()

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
})


