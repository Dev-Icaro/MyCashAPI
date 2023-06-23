'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'username', {
        type: Sequelize.STRING,
        allowNull: false,
      });

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: false,
    });

    await queryInterface.changeColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
    
    await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn('users', 'username', {
        type: Sequelize.STRING,
        allowNull: true,
    });

    await queryInterface.changeColumn('users', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'email', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'first_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    await queryInterface.changeColumn('users', 'last_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });
  }
};
