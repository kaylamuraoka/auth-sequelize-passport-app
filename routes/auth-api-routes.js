// Requiring our models, passport and our written passport.js, as well as bcrypt for when user's want to update their password.
const db = require("../models");
const passport = require("../config/passport");
const bcrypt = require("bcryptjs");

module.exports = (app) => {
  // POST Route that signs a user in, using the passport.authenticate middleware with our local strategy.
  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({
          message: info.message,
        });
      }
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        // User has provided valid login credentials
        return res.status(200).json({ message: "success" });
      });
    })(req, res, next);
  });

  // -------------------------------------------------------------------
  // POST Route for signing up a user. Passwords will be auto hashed and stored securely thanks to
  // how we configured our Sequelize User Model.
  app.post("/api/signup", (req, res) => {
    db.User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phone: req.body.phone,
      password: req.body.password,
    })
      .then(() => {
        // user is created successfully, proceed to log the user in
        res.redirect(307, "/api/login");
      })
      .catch((error) => {
        // otherwise send back an error
        res.status(401).json(error);
      });
  });

  // -------------------------------------------------------------------
  // GET Route for logging user out
  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/login");
  });

  // -------------------------------------------------------------------
  // GET Route for getting some data about our user to be used by the client side
  app.get("/api/user_data", (req, res) => {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.status(404).json({});
    }

    // Otherwise send back the user's email and id
    // Sending back a password, even a hashed password, isn't a good idea
    db.User.findOne({
      where: { id: req.user.id },
      attributes: { exclude: ["password"] },
    })
      .then((dbUser) => {
        res.status(200).json(dbUser);
      })
      .catch((error) => {
        res.status(401).json(error);
      });
  });

  // -------------------------------------------------------------------
  // PUT Route for updating the user's information.
  app.put("/api/user_data", (req, res) => {
    if (!req.user) {
      return;
    }

    db.User.update(
      {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    )
      .then((dbUser) => {
        res.status(200).json(dbUser);
      })
      .catch((error) => {
        res.status(401).json(error);
      });
  });

  // -------------------------------------------------------------------
  // DELETE Route for deleting a user account.
  app.delete("/api/user_data", (req, res) => {
    db.User.destroy({
      where: {
        id: req.user.id,
      },
    })
      .then((dbUser) => {
        res.status(200).json(dbUser);
      })
      .catch((error) => {
        res.status(401).json(error);
      });
  });
};
