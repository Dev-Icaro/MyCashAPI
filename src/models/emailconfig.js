'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class EmailConfig extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  EmailConfig.init({
    server: DataTypes.STRING,
    port: DataTypes.INTEGER,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    useSSL: DataTypes.BOOLEAN,
    useTLS: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'EmailConfig',
  });
  return EmailConfig;
};