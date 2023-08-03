"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Incomes", {
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
      paymentMethod: {
        type: Sequelize.STRING,
      },
      receipt: {
        type: Sequelize.STRING,
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "Users", key: "id" },
      },
      categoryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "Categories", key: "id" },
      },
      accountId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { model: "Accounts", key: "id" },
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
    await queryInterface.dropTable("Incomes");
  },
};
