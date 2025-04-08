
async function consultation(req, res) {

  console.log("sanitizedddddddddddddsdsd")

  console.log(req.body)

  let reasonForConsultation = req.body.reasonForConsultation // string, "headache"
  let imgsToBase64String = req.body.imgsToBase64String // array of base64string, ["data:image/png;base64,iVBORw0KGgoAAAA"]
  let firstname = req.body.firstname // string
  let lastname = req.body.lastname // string
  let dateOfBirth = req.body.dateOfBirth // string
  let gender = req.body.gender // string
  let mobileNumber = req.body.mobileNumber // string

  let helle = req.body.helle

  console.log(helle)
  


}

module.exports = consultation;
