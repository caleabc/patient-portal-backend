// Utils
const storage = require("../utils/storage")

function isAuthorized (req, res, next){
    let authHeader = req.headers.authorization
    let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part

    console.log(authorizationToken)

    let data = storage.get(authorizationToken)

    if (data === null){
        console.log("Unauthorized")
        
        res.status(500).json({ error: "Unauthorized" });
        
        return
    } else {
        next()
    }
}

module.exports = isAuthorized;


