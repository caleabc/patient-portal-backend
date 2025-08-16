
/*

This is use to login for patient account

*/

function createAccessCode() {
  let output = "";

  let characters = "ABCDEFGHJKLMNOPQRSTUVWXYZ23456789";

  for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    output += characters[randomIndex];
  }

  return output;
}

module.exports = createAccessCode;
