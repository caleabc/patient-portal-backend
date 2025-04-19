let mongoose = require("mongoose");

let secretarySchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true }, // Example. "gnwkeiielzrcushfueovnhwiegbevjdc"
  clinicId: { type: String, length: 32, required: true }, // This is a reference from clinic model
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  dateOfBirth: { type: String },
  gender: { type: String },
  phoneNumber: { type: String, required: true } // Example. "+639123456789"
});

let Secretary = mongoose.model("Secretary", secretarySchema);

module.exports = Secretary;
