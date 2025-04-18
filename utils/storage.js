// Models
const AuthorizationTokenData = require("../models/authorizationTokenData")

class Storage {
  async add(key, value) {
    if (!key || value === undefined) {
      throw new Error("Key and value is required");
    }

    const newAuthorizationTokenData = new AuthorizationTokenData({key:key, value:JSON.stringify(value)});

    await newAuthorizationTokenData.save();
  }

  async get(key) {
    if (!key) {
      throw new Error("Key is required to retrieve a value");
    }

    let value = await AuthorizationTokenData.findOne({ key });

    return JSON.parse(value);
  }
}

let storage = new Storage();

// Singleton approach
module.exports = storage;

/*
  -----
  Usage
  -----
  
  let storage = require("../utils/storage")
  
  await storage.add('mykey', 55)
  await storage.get('mykey')
  
*/

