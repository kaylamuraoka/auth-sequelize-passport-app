"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add seed commands here

    await queryInterface.bulkInsert(
      "Users",
      [
        {
          firstName: "John",
          lastName: "Doe",
          email: "jDoegmail.com",
          phone: "1234567890",
          password: "test1234",
          role: "admin",
          isActive: true,
          signUpDate: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    // Commands to revert seed here
    await queryInterface.bulkDelete("Users", null, {});
  },
};
