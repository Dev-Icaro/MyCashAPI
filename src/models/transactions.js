"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Account, { foreignKey: "account_id" });

      Transaction.belongsTo(models.User, { foreignKey: "user_id" });
      // define association here
    }
  }
  Transaction.init(
    {
      amount: DataTypes.DOUBLE,
      date: DataTypes.DATE,
      description: DataTypes.STRING,
      transaction_type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
