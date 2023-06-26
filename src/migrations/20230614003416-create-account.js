'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Accounts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      account_holder_name: {
        type: Sequelize.STRING
      },
      account_number: {
        type: Sequelize.STRING
      },
      account_type: {
        type: Sequelize.STRING
      },
      balance: {
        type: Sequelize.DOUBLE
      },
      currency: {
        type: Sequelize.STRING
      },
      last_transaction: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.STRING
      },
      institution: {
        type: Sequelize.STRING
      },
      overdraft_limit: {
        type: Sequelize.DOUBLE
      },
      user_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {model: 'User', key: 'id'}
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Accounts');
  }
};