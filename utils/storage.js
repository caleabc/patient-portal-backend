/*
README

This is the same to localStorage in the browser

*/

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require("node-localstorage").LocalStorage;
  var localStorage = new LocalStorage("./scratch");
}

class Storage {
  add(key, value) {
    if (!key || value === undefined) {
      throw new Error("Key and value is required");
    }

    localStorage.setItem(key, value);
  }

  get(key) {
    if (!key) {
      throw new Error("Key is required to retrieve a value");
    }

    return localStorage.getItem(key);
  }
}

let storage = new Storage()

// Singleton approach
module.exports = storage;

/*
-----
Usage
-----

let storage = require("../utils/storage")

storage.add('mykey', 55)
storage.get('mykey')

*/
