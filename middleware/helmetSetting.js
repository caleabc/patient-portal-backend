// Library
const helmet = require("helmet");

const helmetSetting = helmet({
  // 🧱 1️⃣ Basic protections
  xssFilter: true, // legacy but harmless
  noSniff: true, // blocks MIME type sniffing
  frameguard: { action: "deny" }, // prevent clickjacking
  hidePoweredBy: true, // hide 'X-Powered-By: Express'
  referrerPolicy: { policy: "no-referrer" }, // prevent referer leaks

  // 🧱 2️⃣ HSTS - force HTTPS (optional if using HTTP locally)
  hsts: {
    maxAge: 60 * 60 * 24 * 60, // 60 days
    includeSubDomains: true,
    preload: true,
  },

  // 🧱 3️⃣ Relaxed but safe Content Security Policy
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // ⚠️ allows React inline hydration (safe if trusted)
        "'unsafe-eval'", // ⚠️ needed if using React dev tools or inline eval() in dev
      ],
      styleSrc: ["'self'", "'unsafe-inline'"], // allow inline CSS (common in React)
      imgSrc: ["'self'", "data:", "blob:"], // allow base64 & blob images
      connectSrc: [
        "'self'",
        "https://api.example.com", // your API backend
        "https://*.cdn.jsdelivr.net", // example CDNs
      ],
      fontSrc: ["'self'", "https:", "data:"],
      objectSrc: ["'none'"],
      frameAncestors: ["'none'"], // prevent embedding in iframes
      upgradeInsecureRequests: [],
    },
  },
});

module.exports = helmetSetting;
