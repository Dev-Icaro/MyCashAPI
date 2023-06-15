'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      account.hasMany(models.transactions,
        { foreignKey: 'account_id' });

      account.hasMany(models.expenses,
        { foreignKey: 'account_id' });

      account.hasMany(models.income,
        { foreignKey: 'income_id' });

      account.belongsTo(models.users,
        { foreignKey: 'user_id' });
    }
  }
  account.init({
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
    modelName: 'account',
  });
  return account;
};