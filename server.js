// DEPENDENCIES - requiring necessary npm packages
require("dotenv").config();
const express = require("express");
const session = require("express-session");
// Requiring passport as we've configured it
const passport = require("./config/passport");

// Setting up port and requiring models for syncing
const PORT = process.env.PORT || 8080;
const db = require("./models");

// MIDDLEWARE - creating express app and configuring middleware needed for authentication
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./client/"));

// We need to use sessions to keep track of our user's login status
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// ROUTES - Requiring our routes as we've configured them
require("./routes/auth-api-routes.js")(app);
require("./routes/html-routes.js")(app);

// LISTENER - Syncing our database and logging a message to the user upon success
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
