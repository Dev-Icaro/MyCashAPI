'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    
    static async findUserByEmail(email) {
      return await this.findOne({ where: { email: String(email) } });
    }

    static associate(models) {
      // define association here
      users.hasMany(models.account, 
        { foreignKey: 'user_id' });

      users.hasMany(models.transactions,
        { foreignKey: 'user_id' });

      users.hasMany(models.expenses,
        { foreignKey: 'user_id' });

      users.hasMany(models.income,
        { foreignKey: 'user_id' });
    }
  }
  users.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    birthday: DataTypes.DATE,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};