// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

// Requiring our custom middleware for checking if a user is logged in
const isAuthenticated = require("../config/middleware/isAuthenticated");

module.exports = (app) => {
  // Front page that renders before a user has logged in
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/login.html"));
  });

  // Route for the user's dashboard after logging in.
  // Here we've add our isAuthenticated middleware to this route.
  // If a user who is not logged in tries to access this route they will be redirected to the login page
  app.get("/user-dashboard", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/user-dashboard.html"));
  });

  app.get("/login", (req, res) => {
    if (req.user) {
      // user already has an account send them to the user's dashboard
      res.redirect("/user-dashboard");
    }
    res.sendFile(path.join(__dirname, "../client/login.html"));
  });

  app.get("/signup", (req, res) => {
    // If the user already has an account send them to the user-dashboard page
    if (req.user) {
      res.redirect("/user-dashboard");
    }
    res.sendFile(path.join(__dirname, "../client/signup.html"));
  });

  app.get("/user-profile", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/user-profile.html"));
  });

  app.get("/forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/forgot-password.html"));
  });

  app.get("/change-password", isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/change-password.html"));
  });

  app.get("/reset/:resetPasswordToken", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/reset-password.html"));
  });
};
