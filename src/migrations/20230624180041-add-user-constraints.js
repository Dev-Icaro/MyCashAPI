"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addConstraint("User", {
      fields: ["username"],
      type: "unique",
      name: "unique_username_constraint",
    });

    await queryInterface.addConstraint("User", {
      fields: ["email"],
      type: "unique",
      name: "unique_email_constraint",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint("User", "unique_username_constraint");
    await queryInterface.removeConstraint("User", "unique_email_constraint");
  },
};
