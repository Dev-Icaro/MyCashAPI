'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      transactions.belongsTo(models.account,
        { foreignKey: 'account_id' });

      transactions.belongsTo(models.users,
        { foreignKey: 'user_id' });
      // define association here
    }
  }
  transactions.init({
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATE,
    description: DataTypes.STRING,
    transaction_type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};