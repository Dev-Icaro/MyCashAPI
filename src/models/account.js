'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.hasMany(models.Transaction,
        { foreignKey: 'account_id' });

      Account.hasMany(models.Expense,
        { foreignKey: 'account_id' });

      Account.hasMany(models.Income,
        { foreignKey: 'ancome_id' });

      Account.belongsTo(models.User,
        { foreignKey: 'user_id' });
    }
  }
  Account.init({
    account_holder_name: DataTypes.STRING,
    account_number: DataTypes.STRING,
    account_type: DataTypes.STRING,
    balance: DataTypes.DOUBLE,
    currency: DataTypes.STRING,
    last_transaction: DataTypes.DATE,
    status: DataTypes.STRING,
    institution: DataTypes.STRING,
    overdraft_limit: DataTypes.DOUBLE
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};