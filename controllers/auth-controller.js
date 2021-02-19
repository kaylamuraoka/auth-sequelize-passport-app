// Requiring our models, passport and our written passport.js, as well as bcrypt for when user's want to update their password.
const db = require("../models");
const passport = require("../config/passport");
const crypto = require("crypto");
require("dotenv").config();
const nodemailer = require("nodemailer");
const nodemailMailgun = require("nodemailer-mailgun-transport");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");

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
      role: req.body.role,
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
  // Function to update password for user when logged in
  updatePassword(req, res) {
    if (!req.user) {
      // The user is not logged in
      return;
    }

    if (bcrypt.compareSync(req.body.currentPassword, req.user.password)) {
      console.log(
        "User's input for current password matches their current password."
      );
      newHash = bcrypt.hashSync(
        req.body.newPassword,
        bcrypt.genSaltSync(10),
        null
      );

      db.User.update(
        { password: newHash },
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
    } else {
      const error = {
        msg: "Oops, that wasn't the right password. Try again.",
      };
      res.status(401).json(error);
    }
  },

  // -------------------------------------------------------------------
  // Function to allow user to reset their password if they forgot it
  sendResetLink(req, res) {
    db.User.findOne({
      where: {
        email: req.body.email,
      },
    }).then((user) => {
      if (!user) {
        console.log("No account found with that email address.");
        res.status(403).send("No account found with that email address.");
      } else {
        // Generate a Token
        const token = crypto.randomBytes(20).toString("hex");

        user.update({
          resetPasswordToken: token, // generated unique hash token
          resetPasswordExpires: Date.now() + 3600000, // valid for one hour after sending the link
        });

        // Configure MailGun with Nodemailer
        // Define authentication for nodemailMailgun
        const auth = {
          auth: {
            api_key: process.env.MAILGUN_API_KEY,
            domain: process.env.MAILGUN_DOMAIN,
          },
        };

        // Create transporter - connecting nodemailer to mailGun
        let transporter = nodemailer.createTransport(nodemailMailgun(auth));

        // Define our mail options - what we want the user to see
        const mailOptions = {
          from: "Excited User <app202055888@heroku.com>",
          to: `${user.email}`,
          subject: "Password reset requested",
          text:
            `Hi ${user.fullName}\n\n` +
            "You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n" +
            "Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it \n\n" +
            `https://fukunaga-and-associates.herokuapp.com/reset/${token}\n\n` +
            "If you did not request this, please ignore this email and your password will remain unchanged.\n",
        };

        // Grab our transporter and use sendMail() function that contains the mailOptions
        transporter.sendMail(mailOptions, function (err, info) {
          if (err) {
            console.log("Error occurred. " + err.message);
            return process.exit(1);
          } else {
            console.log("Message sent: %s", info.messageId);
            res.status(200).json("recovery email sent");
          }
        });
      }
    });
  },

  // -------------------------------------------------------------------
  // Reset Password using the link emailed to the user
  resetPassword(req, res) {
    db.User.findOne({
      where: {
        resetPasswordToken: req.params.resetPasswordToken,
        resetPasswordExpires: {
          [Op.gt]: new Date(),
        },
      },
    }).then((dbUser) => {
      if (!dbUser) {
        console.log("Password reset link is invalid or has expired");
        res
          .status(403)
          .json({ message: "Password reset link is invalid or has expired" });
      } else {
        const hashedPwd = dbUser.generateHash(req.body.password);
        dbUser
          .update({
            password: hashedPwd,
            resetPasswordToken: null,
            resetPasswordExpires: null,
          })
          .then(() => {
            console.log("password updated");
            res.status(200).send({ message: "password updated" });
          });
      }
    });
  },
};

module.exports = authController;
