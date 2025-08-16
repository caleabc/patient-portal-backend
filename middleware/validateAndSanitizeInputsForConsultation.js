// Created by me but improved by chatGPT
function isImgToBase64StringValid(imgToBase64String) {
  const maxSizeMB = 2;
  const allowedMimeTypes = ['png', 'jpeg', 'jpg', 'gif'];

  // Check for valid Base64 format (prefix + base64 data)
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=]+$/;

  if (!base64Regex.test(imgToBase64String)) {
    return false;
  }

  // Extract mime type and base64 string
  const matches = imgToBase64String.match(/^data:image\/(png|jpeg|jpg|gif);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return false;
  }

  const mimeType = matches[1];
  const base64Data = matches[2];

  // Check if mime type is allowed
  if (!allowedMimeTypes.includes(mimeType)) {
    return false;
  }

  // Try decoding base64 to ensure it's not corrupted
  let sizeInBytes;
  try {
    sizeInBytes = Buffer.from(base64Data, 'base64').length;
  } catch (error) {
    return false;
  }

  // Check size in MB
  const sizeInMB = sizeInBytes / (1024 * 1024);
  if (sizeInMB > maxSizeMB) {
    return false;
  }

  return true;
}

// Orig version
function isImgToBase64StringValidv1(imgToBase64String) {
  /*
    
    Checking the size

  */
  let maxSizeMB = 2;

  // Remove the data URL part (e.g., 'data:image/png;base64,')
  const base64Data = imgToBase64String.split(",")[1];

  // Calculate the size in bytes (approximate size of the original file)
  const sizeInBytes = Buffer.from(base64Data, "base64").length;
  const sizeInMB = sizeInBytes / (1024 * 1024); // Convert bytes to MB

  if (sizeInMB > maxSizeMB) {
    // Image is too big, more than 10mn
    return false;
  }

  /*
  
  Checking if valid base64String
  
  */
  const base64Regex = /^data:image\/(png|jpeg|jpg|gif);base64,[A-Za-z0-9+/=]+$/;

  if (!base64Regex.test(imgToBase64String)) {
    return false;
  }

  return true;
}

// Main
function validateAndSanitizeInputsForConsultation(req, res, next) {
  let keys = [
    "reasonForConsultation",
    "firstname",
    "lastname",
    "dateOfBirth",
    "gender",
    "phoneNumber",
  ];

  for (let key of keys) {

    if (key === "imgsToBase64String") {
      let imgsToBase64String = req.body[key];

      // imgsToBase64String must be array
      if (typeof imgsToBase64String !== "object") {
        return res.status(500).json({ error: "Invalid input" });
      }

      // Loop every item on the array
      for (let imgToBase64String of imgsToBase64String) {
        if (isImgToBase64StringValid(imgToBase64String) === false) {
          return res.status(500).json({ error: "Invalid input" });
        }
      }
    } else {
      let input = req.body[key];

      // Must be a string data type
      if (typeof input !== "string") {
        return res.status(400).json({ error: "Firstname must be a string." });
      }

      // Trim whitespace
      input = input.trim();

      // Required field are only for reasonForConsultation, firstname, lastname, dateOfBirth
      if (
        (key === "reasonForConsultation" ||
          key === "firstname" ||
          key === "lastname",
        key === "dateOfBirth")
      ) {
        if (input.length === 0) {
          return res.status(400).json({ error: "Invalid input" });
        }
      }

      // Reject if too long
      if (input.length > 500) {
        return res.status(400).json({ error: "Invalid input" });
      }

      // Reject if it contains dangerous characters, helps prevent noSQL injection
      const forbiddenChars = /[$\{\}\[\];`]/;
      if (forbiddenChars.test(input)) {
        return res.status(400).json({ error: "Invalid input" });
      }

      // Escape basic HTML special characters, helps prevent XSS
      function escapeHtml(input) {
        return input
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#039;");
      }
      input = escapeHtml(input);

      // After validating and sanitizing update the current value
      req.body[key] = input;
    }
  }

  /*
    
    Inputs are validated and sanitized

  */

  let validatedandSanitizedInputs = {};

  for (let key of keys) {
    validatedandSanitizedInputs[key] = req.body[key];
  }

  /*
  
  This is very important, update the request body, this time it is now validated and sanitized

  */
  req.body = validatedandSanitizedInputs;

  /*
  
  Go to next function

  */
  next();
}

module.exports = validateAndSanitizeInputsForConsultation;
