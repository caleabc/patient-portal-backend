let mongoose = require("mongoose");

let authorizationDataSchema = new mongoose.Schema({
  authorizationToken: { type: String, length: 32, required: true }, // Example. "gnwkeiielzrcushfueovnhwiegbevjdc"
  role: { type: String, required: true },
  id: { type: String, required: true }, // If role is patient then this "id" is pointing to patient schema "id" field, if role is secretary then this "id" is pointing to secretary schema "id" field, if role is doctor then this "id" is pointing to doctor schema "id" field
  createdAt: { type: Date, default: Date.now },
});

let AuthorizationData = mongoose.model(
  "AuthorizationData",
  authorizationDataSchema
);

module.exports = AuthorizationData;
