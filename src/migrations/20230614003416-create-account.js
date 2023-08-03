"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Accounts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      accountHolderName: {
        type: Sequelize.STRING,
      },
      accountNumber: {
        type: Sequelize.STRING,
      },
      accountType: {
        type: Sequelize.STRING,
      },
      balance: {
        type: Sequelize.DOUBLE,
      },
      currency: {
        type: Sequelize.STRING,
      },
      lastTransaction: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.STRING,
      },
      institution: {
        type: Sequelize.STRING,
      },
      overdraftLimit: {
        type: Sequelize.DOUBLE,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Accounts");
  },
};
