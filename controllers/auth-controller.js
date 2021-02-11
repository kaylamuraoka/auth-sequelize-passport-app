// Requiring our models, passport and our written passport.js, as well as bcrypt for when user's want to update their password.
const db = require("../models");
const passport = require("../config/passport");
const crypto = require("crypto");
require("dotenv").config();
const nodemailer = require("nodemailer");

const authController = {
  // -------------------------------------------------------------------
  // Logout user
  logout(req, res) {
    req.logout();
    res.redirect("/login");
  },

  // -------------------------------------------------------------------
  // Login user using the passport.authenticate middleware with our local strategy.
  login(req, res, next) {
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
  },

  // -------------------------------------------------------------------
  // Signup/create a new user
  // Passwords will be auto hashed and stored securely thanks to how we configured our Sequelize User Model.
  signup(req, res) {
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
  },

  // -------------------------------------------------------------------
  // Function for getting some data about our user to be used by the client side
  getUserData(req, res) {
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
  },

  // -------------------------------------------------------------------
  // Function for updating a user's information.
  updateUser(req, res) {
    if (!req.user) {
      // The user is not logged in
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
  },

  // -------------------------------------------------------------------
  // Function for deleting a user
  deleteUser(req, res) {
    if (!req.user) {
      // The user is not logged in
      return;
    }

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
  },

  // -------------------------------------------------------------------
  // Function to update password for user
  updatePassword(req, res) {
    if (!req.user) {
      // The user is not logged in
      return;
    }
    // Otherwise, if user is logged in
    db.User.update(
      { password: req.body.password },
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
  },

  // -------------------------------------------------------------------
  // Function to allow user to reset their password if they forgot it
  resetPassword(req, res) {},
};

module.exports = authController;
