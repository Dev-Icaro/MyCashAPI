'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('User', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
      });

    await queryInterface.changeColumn('User', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('User', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('User', 'first_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    
    await queryInterface.changeColumn('User', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('User', 'username', {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.changeColumn('User', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('User', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('User', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('User', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
