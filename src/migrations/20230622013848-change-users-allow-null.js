"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "firstName", {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn("Users", "lastName", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("Users", "username", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "password", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "email", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "firstName", {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn("Users", "lastName", {
      type: Sequelize.STRING,
      allowNull: true,
    });
  },
};
