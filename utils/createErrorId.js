function createErrorId() {
  let output = "";

  let characters = "abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < 9; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    output += characters[randomIndex];
  }

  return output;
}
