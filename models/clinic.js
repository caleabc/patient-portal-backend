let mongoose = require("mongoose");


let addressSchema = new mongoose.Schema({
  buildingName: { type: String },
  street: { type: String },
  barangay: { type: String },
  cityOrMunicipality: { type: String },
  province: { type: String },
  country: { type: String }
})

let scheduleSchema = new mongoose.Schema({
  monday: { type: String },
  tuesday: { type: String },
  wednesday: { type: String },
  thursday: { type: String },
  friday: { type: String },
  saturday: { type: String },
  sunday: { type: String }
})

// Main
let clinicSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  clinicName: { type: String, required: true },
  schedule: { type: scheduleSchema },
  address: { type: addressSchema },
});

let Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;
