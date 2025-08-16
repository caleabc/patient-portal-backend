// Lib
const CryptoJS = require("crypto-js");

function encrypt(data, key) {
  if (key.length !== 32) {
    throw new Error(
      "Encryption key must be a 32-character length truly random string like 'thbfsdfgfdejkjkycvbnmngfqwaiazbm' "
    );
  }

  // Stringify the data
  data = JSON.stringify(data);

  // The placement of parameters or arguments in CryptoJS.AES.encrypt() cannot be interchanged

  const encrypted = CryptoJS.AES.encrypt(data, key).toString();

  return encrypted;
}

function decrypt(encryptedData, key) {
  // The placement of parameters or arguments in CryptoJS.AES.decrypt() cannot be interchanged

  // Decrypt the data
  const decrypted = CryptoJS.AES.decrypt(encryptedData, key);

  // Convert decrypted data back to a UTF-8 string
  const data = decrypted.toString(CryptoJS.enc.Utf8);

  // Parse JSON string back into an object
  return JSON.parse(data);
}

/*
-----
Usage
-----

let data = { name:'Mike' email: 'mike@yahoo.com' }
let data = [2,5,6,2]
let data = "Ben"
let data = 51

// 'data' can be any data type

// For sample purposes sampleEncryptionKey is hard coded but in production this must be from environment variables
let sampleEncryptionKey = 'thbfsdfgfdejkjkycvbnmngfqwaiazbm'

let encryptedData = encrypt(data, sampleEncryptionKey);
let decryptedData = decrypt(encryptedData, sampleEncryptionKey);
*/


module.exports = {encrypt, decrypt}


