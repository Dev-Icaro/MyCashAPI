"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static async getAccountById(id) {
      return await this.findOne({
        where: {
          id: Number(id),
        },
      });
    }

    static associate(models) {
      // define association here
      Account.hasMany(models.Transaction, { foreignKey: "account_id" });

      Account.hasMany(models.Expense, { foreignKey: "account_id" });

      Account.hasMany(models.Income, { foreignKey: "income_id" });

      Account.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Account.init(
    {
      account_holder_name: DataTypes.STRING,
      account_number: DataTypes.STRING,
      account_type: DataTypes.STRING,
      balance: DataTypes.DOUBLE,
      currency: DataTypes.STRING,
      last_transaction: DataTypes.DATE,
      status: DataTypes.STRING,
      institution: DataTypes.STRING,
      overdraft_limit: DataTypes.DOUBLE,
    },
    {
      sequelize,
      modelName: "Account",
    }
  );
  return Account;
};
