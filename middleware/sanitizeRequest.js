/*

- this backend/server currently accept string property value due to security concern like nosql attack, if object then must be deleted
- purpose of sanitize-html is to protect the backend/server from xss attack

- only sanitize or modify headers that come from your own frontend code (e.g., custom headers you explicitly set), Do not blanket-sanitize all request headers — because most headers are automatically added by browsers, proxies, or Node internals, and changing them can break normal HTTP behavior.

*/

// Library
const sanitizeHtml = require("sanitize-html");

async function sanitizeRequest(req, res, next) {

  // sanitize body
  if (req.body && typeof req.body === "object") {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key]);
      } else if (typeof req.body[key] === "number"){
        // do nothing since number alone is safe and cannot contain harmful code
      } else {
        delete req.body[key];
      }
    }
  }

  // sanitize query
  if (req.query && typeof req.query === "object") {
    for (let key in req.query) {
      if (typeof req.query[key] === "string") {
        req.query[key] = sanitizeHtml(req.query[key]);
      } else if (typeof req.query[key] === "number"){
        // do nothing since number alone is safe and cannot contain harmful code
      } else {
        delete req.query[key];
      }
    }
  }

  // sanitize params
  if (req.params && typeof req.params === "object") {
    for (let key in req.params) {
      if (typeof req.params[key] === "string") {
        req.params[key] = sanitizeHtml(req.params[key]);
      } else if (typeof req.params[key] === "number"){
        // do nothing since number alone is safe and cannot contain harmful code
      } else {
        delete req.params[key];
      }
    }
  }

  next();
}

module.exports = sanitizeRequest;
