let mongoose = require("mongoose");

let scheduleSchema = new mongoose.Schema({
  monday: { type: String, required: true },
  tuesday: { type: String, required: true },
  wednesday: { type: String, required: true },
  thursday: { type: String, required: true },
  friday: { type: String, required: true },
  saturday: { type: String, required: true },
  sunday: { type: String, required: true },
});

let addressSchema = new mongoose.Schema({
  country: { type: String, required: true },
  province: { type: String, required: true },
  city: { type: String, required: true },
  street: { type: String, required: true },
});

// Main
let clinicSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true },
  clinicName: { type: String, required: true },
  schedule: { type: scheduleSchema, required: true },
  address: { type: addressSchema, required: true },
});

let Clinic = mongoose.model("Clinic", clinicSchema);

module.exports = Clinic;
