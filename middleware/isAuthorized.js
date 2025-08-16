// Models
const AuthorizationData = require("../models/authorizationData")

async function isAuthorized (req, res, next){
    let authHeader = req.headers.authorization
    let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part

    let authorizationData = await AuthorizationData.findOne({authorizationToken})

    if (authorizationData === null){
        console.log("Unauthorized")
        
        res.status(500).json({ error: "Unauthorized" });
        
        return
    } else {
        next()
    }
}

module.exports = isAuthorized;


