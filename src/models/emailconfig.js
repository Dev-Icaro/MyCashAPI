'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class emailConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  emailConfig.init({
    server: DataTypes.STRING,
    port: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    useSSL: DataTypes.BOOLEAN,
    useTLS: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'emailConfig',
  });
  return emailConfig;
};