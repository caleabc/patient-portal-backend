let mongoose = require("mongoose");

let authorizationDataSchema = new mongoose.Schema({
  authorizationToken: { type: String, length: 32, required: true }, // Example. "gnwkeiielzrcushfueovnhwiegbevjdc"
  phoneNumber: { type: String, required: true },
  clinicId: { type: String, required: true },
  clinicName: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  role: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

let AuthorizationData = mongoose.model(
  "AuthorizationData",
  authorizationDataSchema
);

module.exports = AuthorizationData;
