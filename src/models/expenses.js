'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class expenses extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      expenses.belongsTo(models.users,
        { foreignKey: 'user_id' });

      expenses.belongsTo(models.account,
        { foreignKey: 'account_id' });

      expenses.belongsTo(models.category,
        { foreignKey: 'category_id' });
    }
  }
  expenses.init({
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATE,
    description: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    receipt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'expenses',
  });
  return expenses;
};