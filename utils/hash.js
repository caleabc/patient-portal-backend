const crypto = require("crypto");

function hash(input) {
  input.toLowerCase()

  return crypto.createHash("sha256").update(input).digest("hex");
}

module.exports = hash

/*

Usage

const hashedLastName = hash("smith");
console.log(hashedLastName); // Outputs a SHA-256 hex string

*/

