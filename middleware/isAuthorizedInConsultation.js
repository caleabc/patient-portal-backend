// Utils
const storage = require("../utils/storage")

function isAuthorizedInConsultation (req, res, next){
    let authHeader = req.headers.authorization
    let authorizationToken = authHeader && authHeader.split(' ')[1]; // Gets just the token part

    let info = storage.get(authorizationToken)

    if (info === null){
        res.status(500).json({ error: "Unauthorized" });
        return
    }

    let role = info.role

    if (role === "secretary" || role === "doctor"){
        next()
    } else {
        res.status(500).json({ error: "Unauthorized" });
        return
    }
}

module.exports = isAuthorizedInConsultation;


