function createOtp() {
  let output = "";

  let digits = "0123456789";

  for (let i = 0; i < 6; i++) {
    let randomIndex = Math.floor(Math.random() * digits.length);
    output += digits[randomIndex];
  }

  return Number(output);
}

module.exports = createOtp;
