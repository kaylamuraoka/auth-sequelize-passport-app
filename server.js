// DEPENDENCIES - requiring necessary npm packages
const express = require("express");

const PORT = process.env.PORT || 8080;

// MIDDLEWARE
// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

// LISTENER
app.listen(PORT, () => {
  console.log(
    `Listening on port ${PORT}. Visit http://localhost:${PORT} in your browser.`
  );
});
