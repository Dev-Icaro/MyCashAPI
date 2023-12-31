"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Transactions", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      amount: {
        type: Sequelize.DOUBLE,
      },
      date: {
        type: Sequelize.DATE,
      },
      description: {
        type: Sequelize.STRING,
      },
      transactionType: {
        type: Sequelize.STRING,
      },
      accountId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "Accounts", key: "id" },
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
    await queryInterface.dropTable("Transactions");
  },
};
