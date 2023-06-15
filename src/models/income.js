'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      income.belongsTo(models.users,
        { foreignKey: 'user_id' });

      income.belongsTo(models.account,
        { foreignKey: 'account_id' });

      income.belongsTo(models.category,
        { foreignKey: 'category_id' });
    }
  }
  income.init({
    amount: DataTypes.DOUBLE,
    date: DataTypes.DATE,
    description: DataTypes.STRING,
    payment_method: DataTypes.STRING,
    receipt: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'income',
  });
  return income;
};