/*

This is to sanitize inputs from consultation

*/

const { body, validationResult } = require("express-validator");

// Helper to check Base64 size (in MB)
const isBase64SizeValid = (base64String, maxSizeMB = 10) => {
  // Remove the data URL part (e.g., 'data:image/png;base64,')
  const base64Data = base64String.split(",")[1];

  // Calculate the size in bytes (approximate size of the original file)
  const sizeInBytes = Buffer.from(base64Data, "base64").length;
  const sizeInMB = sizeInBytes / (1024 * 1024); // Convert bytes to MB

  return sizeInMB <= maxSizeMB; // Check if within limit
};

/*

Sanitization and validation

*/
const validateConsultation = [
  body("imgsToBase64String")
    .isArray()
    .withMessage("Photos must be an array of base64 strings"),

  // Loop through each item in the array
  body("imgsToBase64String.*").custom((value) => {
    const base64Regex =
      /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=]+$/;

    if (!base64Regex.test(value)) {
      throw new Error("Invalid base64 image format");
    }

    if (!isBase64SizeValid(value)) {
      throw new Error("Base64 image exceeds the 10MB size limit");
    }

    return true;
  }),

  body("reasonForConsultation")
    .trim()
    .escape() // Helps prevent XSS attack
    .not()
    .matches(/[$\{\}\[\];`]/) // Reject input if it contains $, {, }, [, ], ;, or `. Helps prevent noSQL attack
    .notEmpty(),

  body("firstname")
    .trim()
    .isLength({ max: 500 })
    .escape()
    .not()
    .matches(/[$\{\}\[\];`]/) // Reject input if it contains $, {, }, [, ], ;, or `. Helps prevent noSQL attack
    .notEmpty(),

  body("lastname")
    .trim()
    .isLength({ max: 500 })
    .escape()
    .not()
    .matches(/[$\{\}\[\];`]/) // Reject input if it contains $, {, }, [, ], ;, or `. Helps prevent noSQL attack
    .notEmpty(),

  body("dateOfBirth")
    .trim()
    .isLength({ max: 500 })
    .escape()
    .not()
    .matches(/[$\{\}\[\];`]/) // Reject input if it contains $, {, }, [, ], ;, or `. Helps prevent noSQL attack
    .notEmpty(),

  body("gender")
    .trim()
    .isLength({ max: 500 })
    .escape()
    .not()
    .matches(/[$\{\}\[\];`]/), // Reject input if it contains $, {, }, [, ], ;, or `. Helps prevent noSQL attack

  body("mobileNumber")
    .trim()
    .isLength({ max: 500 })
    .escape()
    .not()
    .matches(/[$\{\}\[\];`]/), // Reject input if it contains $, {, }, [, ], ;, or `. Helps prevent noSQL attack
];

/*

Check the result of sanitization

*/
const checkValidationResult = (req, res, next) => {


  console.log('req ikik')
  console.log(req)


  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    /*
    
    Respond to a request saying 'Something wrong on validation and sanitization of inputs'
    
    */
    return res.status(500).json({ errors: errors.array() });
  }

  /*
  
  Since no error then proceed to next function
  
  */
  next();
};

module.exports = { validateConsultation, checkValidationResult };
