/*

README

Why authorization token needs to be 32 character length? So that it will be really hard to guess

*/

function createAuthorizationToken() {
  let output = "";

  let characters = "abcdefghijklmnopqrstuvwxyz";

  for (let i = 0; i < 32; i++) {
    let randomIndex = Math.floor(Math.random() * characters.length);
    output += characters[randomIndex];
  }

  return output;
}

module.exports = createAuthorizationToken;
