function createId() {
  let output = "";

  let characters = "abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < 32; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    output += characters[randomIndex];
  }

  return output;
}

module.exports = createId
