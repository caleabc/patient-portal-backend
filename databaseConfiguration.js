/*

Database configuration

*/

const mongoose = require( "mongoose")

async function dbConfiguration() {
  let uri = process.env.MONGODB_URI;

  console.log("uri kfdfjdkfjd")
  console.log(uri)

  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error)
    console.log("MongoDB connection error");
  }
}

module.exports = dbConfiguration

