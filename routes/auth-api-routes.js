// Require controller and multer modules
const authController = require("../controllers/auth-controller");
const upload = require("../config/multer");

module.exports = (app) => {
  /// AUTH ROUTES ///

  // POST Route that signs a user in.
  app.post("/api/login", authController.login);

  // POST Route for signing up a user.
  app.post("/api/signup", upload.single("image"), authController.signup);

  // GET Route for logging user out.
  app.get("/logout", authController.logout);

  // GET Route for getting data about a user to be used by the client side.
  app.get("/api/user_data", authController.getUserData);

  // PUT Route for updating a user's information.
  app.put("/api/user_data", authController.updateUser);

  // PUT Route for updating a user's password.
  app.put("/api/change_password", authController.updatePassword);

  // DELETE Route for deleting a user account.
  app.delete("/api/user_data", authController.deleteUser);

  // POST Route for sending a link to the user's email to reset their password
  app.post("/api/forgot_password", authController.sendResetLink);

  // POST Route for checking the resetPasswordToken passed from the link’s query parameters and date timestamp to ensure that everything’s good.
  // In this case we have a single query parameter, named resetPasswordToken
  app.post("/api/reset/:resetPasswordToken", authController.resetPassword);
};
