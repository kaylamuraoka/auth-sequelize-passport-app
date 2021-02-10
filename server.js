// DEPENDENCIES - requiring necessary npm packages
const express = require("express");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// MIDDLEWARE
// Creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ROUTES
app.get("/", (req, res) => {
  res.send("Hello");
});

// LISTENER
// Syncing our database and logging a message to the user upon success
db.sequelize
  .sync({ force: true })
  .then(() => {
    // ok ... everything is nice!
    console.log("All models were synchronized successfully.");
    app.listen(PORT, () => {
      console.log(
        `==> 🌎 Listening on port ${PORT}. Visit http://localhost:${PORT} in your browser.`
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
