'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('EmailConfigs', 'default', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('EmailConfigs', 'default');
  }
};
