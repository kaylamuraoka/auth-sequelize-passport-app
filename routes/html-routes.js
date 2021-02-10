// Requiring path to so we can use relative routes to our HTML files
const path = require("path");

module.exports = (app) => {
  // Front page that renders before a user has logged in
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/login.html"));
  });
};
