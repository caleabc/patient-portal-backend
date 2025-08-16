function verifyAccessIdForPhoneNumberRegistration (req, res, next){
    let inputFromUser = req.body.accessIdForPhoneNumberRegistration

    let accessIdForPhoneNumberRegistration = process.env.ACCESS_ID_FOR_PHONE_NUMBER_REGISTRATION

    if (inputFromUser === accessIdForPhoneNumberRegistration){
        next()
    } else {
        return res.status(500).json({ message: "Unauthorized" });
    }
}

module.exports = verifyAccessIdForPhoneNumberRegistration


