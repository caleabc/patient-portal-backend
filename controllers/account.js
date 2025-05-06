// Models
let Patient = require("../models/patient");
let Secretary = require("../models/secretary");
let Doctor = require("../models/doctor");
let AuthorizationData = require("../models/authorizationData")

async function account(req, res) {
  let role = req.body.role;
  let id = req.body.id;

  try {
    if (role === "patient") {
      let account = await Patient.findOne({ id });

      // Decrypt
      account = account.decrypt();

      res.status(200).json(account);
    }

    if (role === "secretary") {
      let account = await Secretary.findOne({ id });

      res.status(200).json(account);
    }

    if (role === "doctor") {
      let account = await Doctor.findOne({ id });

      res.status(200).json(account);
    }
  } catch (error) {
    console.log(error);
    console.log("Error in getting account");
    res.status(500).json({ message: "Error in getting account" });
  }
}

async function updateAccount(req, res) {
  
  let authHeader = req.headers.authorization
  let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part

  let authorizationData = await AuthorizationData.findOne({authorizationToken})

  let role = authorizationData.role
  let id = authorizationData.id

  try {
    if (role === "patient") {
      let {firstname, lastname} = req.body

      let updatedAccount = await Patient.findOneAndUpdate({id}, { $set: { firstname, lastname } }, {new:true})
      res.status(200).json(updatedAccount);
    }

    if (role === "secretary") {
      let {firstname, lastname} = req.body

      let updatedAccount = await Secretary.findOneAndUpdate({id}, { $set: { firstname, lastname } }, {new:true})
      res.status(200).json(updatedAccount);
    }

    if (role === "doctor") {
      let {firstname, lastname, specialty, licenseNumber} = req.body

      let updatedAccount = await Doctor.findOneAndUpdate({id}, { $set: { firstname, lastname, specialty, licenseNumber } }, {new:true})
      res.status(200).json(updatedAccount);
    }

  } catch (error) {
    console.log(error);
    console.log("Error in getting account");
    res.status(500).json({ message: "Error in getting account" });
  }
}

module.exports = {account, updateAccount};


