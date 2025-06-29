/*

Database configuration

*/

const mongoose = require( "mongoose")

async function dbConfiguration() {
  let uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log("MongoDB connection error:", error);
  }
}

module.exports = dbConfiguration

