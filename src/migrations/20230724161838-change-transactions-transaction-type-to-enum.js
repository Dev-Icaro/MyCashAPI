"use strict";

const TransactionTypesEnum = require("../enums/transaction-types-enum");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn("transactions", "transactionType", {
      type: Sequelize.ENUM(...Object.values(TransactionTypesEnum)),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn("transactions", "transactionType", {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },
};
