// Require our passport packages
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const db = require("../models");

// Telling passport we want to use a Local Strategy.
// Local Strategy is going to allow us to use a local login with email and password rather than eg. Google or Facebook
passport.use(
  new LocalStrategy(
    // Our user will sign in using an email, rather than a "username"
    {
      usernameField: "email",
    },
    (email, password, done) => {
      // a response from the database to see if the user's inputted email matches on in the database
      // When a user tries to sign in this code runs
      db.User.findOne({
        where: {
          email: email,
        },
      })
        .then((dbUser) => {
          // IF there's no user with the given email...
          // If the credentials are not valid (for example, if the password is incorrect), done should be invoked with false instead of a user to indicate an authentication failure.
          if (!dbUser) {
            console.log(
              "Login Error: No account found with that email address."
            );
            return done(null, false, {
              message: "No account found with that email address.",
            });
          }
          // IF there's a user with the given email. but the password the user gives us is incorrect.
          else if (!dbUser.validPassword(password)) {
            console.log(
              "Login Error: The password you entered is incorrect. Please try again."
            );
            return done(null, false, {
              message:
                "The password you entered is incorrect. Please try again.",
            });
          }

          // IF none of the above, return the user.
          return done(null, dbUser);
        })
        .catch((err) => {
          console.log("Error: ", err);

          return done(null, false, {
            message: "Something went wrong with your Login",
          });
        });
    }
  )
);

// In order to help keep authentication state across HTTP requests,
// Sequelize needs to serialize and deserialize the user
// Just consider this part boilerplate needed to make it all work
passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

// Exporting our configured passport
module.exports = passport;
