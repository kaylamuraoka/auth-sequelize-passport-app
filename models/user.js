// Requiring bcrypt for password hashing. Using the bcryptjs version as the regular bcrypt module sometimes causes errors on Windows machines
const bcrypt = require("bcryptjs");

// Creating our User model
module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: 2,
            msg: "First Name must be at least 2 characters in length",
          },
        },
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: {
            args: 2,
            msg: "Last Name must be at least 2 characters in length",
          },
        },
      },
      // VIRTUAL field does not cause a column in the table to exist.
      fullName: {
        type: DataTypes.VIRTUAL,
        get() {
          return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
          throw new Error("Do not try to set the `fullName` value!");
        },
      },
      // The email cannot be null, and must be a proper email before creation
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [6, 128],
            msg: "Email address must be between 6 and 128 characters in length",
          },
          isEmail: {
            msg: "The email address you entered is invalid",
          },
        },
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: {
            args: [10, 10],
            msg: "The phone number you entered is invalid",
          },
          isNumeric: {
            msg: "The phone number you entered is invalid",
          },
        },
      },
      avatar: {
        type: DataTypes.STRING,
      },
      // cloudinaryId is needed for sending put/delete requests for avatar (image)
      cloudinaryId: {
        type: DataTypes.STRING,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: false,
        },
      },
      role: {
        type: DataTypes.ENUM,
        values: ["Administrator", "Client", "Employee"],
        allowNull: false,
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
      },
    },
    {
      modelName: "User",
      timestamps: true,
      // I want updatedAt to actually be called signUpDate
      createdAt: "signUpDate",
    }
  );
  // Creating a custom method for our User model. This will check if an unhashed password entered by the user can be compared to the hashed password stored in our database
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

  User.prototype.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
  };

  // Hooks are automatic methods that run during various phases of the User Model lifecycle
  // In this case, before a User is created, we will automatically hash their password
  User.addHook("beforeCreate", (user) => {
    user.password = bcrypt.hashSync(
      user.password,
      bcrypt.genSaltSync(10),
      null
    );
  });

  return User;
};
