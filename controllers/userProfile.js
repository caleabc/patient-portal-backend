/*

README

This file is just for verification, this is just created to determine if an authorizationToken is valid

*/

async function userProfile(req, res){
    res.status(200).json({ message: "Authorization token is valid" });
}

module.exports = userProfile


