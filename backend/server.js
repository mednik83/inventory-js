const express = require("express");

const app = express();

const host = "localhost";
const port = 8010;

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, host, () => {
  console.log(`Server lisnets http://${host}:${port}`);
});
