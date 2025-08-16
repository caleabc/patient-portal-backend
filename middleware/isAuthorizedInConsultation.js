// Models
const AuthorizationData = require("../models/authorizationData");

async function isAuthorizedInConsultation(req, res, next) {
  let authHeader = req.headers.authorization;
  let authorizationToken = authHeader && authHeader.split(" ")[1]; // Gets just the token part

  /*
    
    TODO: Wrap the network request code line 14 in a try catch block
    
  */
  let authorizationData = await AuthorizationData.findOne({
    authorizationToken,
  });

  if (authorizationData === null) {
    res.status(500).json({ error: "Unauthorized" });
    return;
  }

  let role = authorizationData.role;

  if (role === "secretary" || role === "doctor") {
    next();
  } else {
    res.status(500).json({ error: "Unauthorized" });
    return;
  }
}

module.exports = isAuthorizedInConsultation;
