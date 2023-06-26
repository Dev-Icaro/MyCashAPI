'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expense.belongsTo(models.User,
        { foreignKey: 'user_id' });

      Expense.belongsTo(models.Account,
        { foreignKey: 'account_id' });

      Expense.belongsTo(models.Category,
        { foreignKey: 'category_id' });
    }
  }
  Expense.init({
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATE,
    description: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    receipt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Expense',
  });
  return Expense;
};