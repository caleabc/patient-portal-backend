/*
Scenario:
- A server must have a request limit in order to prevent abuse

Steps:
- Create first our own server named "myServer" then do lots of request (500 request in a very short period of time) to "Patient Portal" server to test if they added request limit
- ...

*/

const express = require("express");
const app = express();

app.get("/", async (req, res) => {
  try {
    /*
        
        Send 500 request

    */
    for (let i = 0; i < 500; i++) {
      const response = await fetch("http://localhost:5000");
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json(); // Parse JSON response
      console.log(data); // Log the fetched data
    }

    console.log("Server request limit: Failed");
    res.send("Request sent");
  } catch (error) {
    console.log(error);

    console.log("Server request limit: Passed");
  }
});

const port = 5001;
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
