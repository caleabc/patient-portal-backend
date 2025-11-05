
async function isAuthorized (req, res, next){

    const authorizationToken = req.cookies.authorizationToken;

    if (authorizationToken === undefined){
        console.log("no authorization token found")
        res.status(400).json({ error: "Unauthorized" });
    } else {
        next()
    }
}

module.exports = isAuthorized;

