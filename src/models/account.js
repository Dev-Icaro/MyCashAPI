"use strict";
const { Model } = require("sequelize");
const errorConsts = require("../constants/error-constants");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    static async addToBalance(amount) {
      this.balance += amount;
      return await this.save();
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
      account_holder_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("account_number"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("account_number"),
          },
          isInt: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("account_number"),
          },
        },
      },
      account_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("account_type"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotNullErr("account_type"),
          },
        },
      },
      balance: {
        type: DataTypes.DOUBLE,
        defaultValue: 0.0,
      },
      currency: {
        type: DataTypes.STRING,
        defaultValue: "BRL",
      },
      last_transaction: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
        validate: {
          isAlpha: {
            msg: ErrorMessageFormatter.formatInvalidFormatErr("status"),
          },
        },
      },
      institution: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("institution"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("institution"),
          },
        },
      },
      overdraft_limit: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
          isFloat: {
            msg: ErrorMessageFormatter.formatNotFloatErr("overdraft_limit"),
          },
        },
      },
    },
    {
      sequelize,
      modelName: "Account",
    },
  );
  return Account;
};
