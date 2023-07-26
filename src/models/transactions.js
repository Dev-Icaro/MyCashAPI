"use strict";
const { Model } = require("sequelize");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
const TransactionTypesEnum = require("../enums/transaction-types-enum");
//const UserService = require("../services/user-service");
//const AccountService = require("../services/account-service");

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
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.requiredField("amount"),
          },
          isFloat: {
            msg: ErrorMessageFormatter.notFloat("amout"),
          },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.requiredField("date"),
          },
          isDate: {
            msg: ErrorMessageFormatter.invalidDateTime("date"),
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.requiredField("description"),
          },
        },
      },
      transaction_type: {
        type: DataTypes.ENUM(...Object.values(TransactionTypesEnum)),
        allowNull: false,
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.requiredField("transaction_type"),
          },
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.requiredField("user_id"),
          },
        },
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.requiredField("account_id"),
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Transaction",
    },
  );
  return Transaction;
};
