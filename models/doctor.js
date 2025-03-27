let mongoose = require("mongoose");

let doctorSchema = new mongoose.Schema({
  id: { type: String, length: 32, required: true }, // Example. "gnwkeiielzrcushfueovnhwiegbevjdc"
  clinicId: { type: String, length: 32, required: true }, // This is a reference from clinic model
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
});

let Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
