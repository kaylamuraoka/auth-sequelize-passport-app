// This is middleware for checking if user's role is permitted to make request
const rolePermissions = {
  isAdmin(req, res, next) {
    // If the user is admin, continue with the request to the restricted route
    if (req.user) {
      if (req.user.role === "Administrator") {
        // authentication and authorization successful
        return next();
      }
    }

    res.redirect("/login");
  },
  isClient(req, res, next) {
    // If the user is client, continue with the request to the restricted route
    if (req.user) {
      if (req.user.role === "Client") {
        // authentication and authorization successful
        return next();
      }
    }
    res.redirect("/login");
  },
  isEmp(req, res, next) {
    // If the user is employee, continue with the request to the restricted route
    if (req.user) {
      if (req.user.role === "Employee") {
        // authentication and authorization successful
        return next();
      }
    }
    res.redirect("/login");
  },
};

module.exports = rolePermissions;
