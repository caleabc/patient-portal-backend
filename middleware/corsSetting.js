// Lib
const cors = require("cors")

const corsSetting = cors({
  // ✅ Allowed origins (frontend URLs that can access this backend)
  // Use an array to allow multiple frontends (e.g., production + localhost for dev)
  origin: [
    "https://your-frontend.com", // production frontend
    "http://localhost:3000", // local React dev server
  ],

  // ✅ Allow sending cookies and auth headers
  // Needed for HttpOnly cookie-based authentication
  credentials: true,

  // ✅ Cache preflight (OPTIONS) response for 10 minutes
  // Reduces how often browsers send preflight requests
  maxAge: 2580000, // in seconds (around 1 month)
});

module.exports = corsSetting;

