"use strict";
const { Model } = require("sequelize");
const errorConsts = require("../constants/error-constants");
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
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
            msg: errorConsts.ERROR_REQUIRED_FIELD.replace(
              "{placeholder}",
              "account_number",
            ),
          },
          notEmpty: {
            msg: errorConsts.ERROR_EMPTY_FIELD.replace(
              "{placeholder}",
              "account_number",
            ),
          },
          isInt: {
            msg: errorConsts.ERROR_NOT_INT.replace(
              "{placeholder}",
              "account_number",
            ),
          },
        },
      },
      account_type: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: errorConsts.ERROR_REQUIRED_FIELD.replace(
              "{placeholder}",
              "account_type",
            ),
          },
          notEmpty: {
            msg: errorConsts.ERROR_EMPTY_FIELD.replace(
              "{placeholder}",
              "account_type",
            ),
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
            msg: errorConsts.ERROR_INVALID_FORMAT.replace(
              "{placeholder}",
              "status",
            ),
          },
        },
      },
      institution: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: errorConsts.ERROR_REQUIRED_FIELD.replace(
              "{placeholder}",
              "institution",
            ),
          },
          notEmpty: {
            msg: errorConsts.ERROR_EMPTY_FIELD.replace(
              "{placeholder}",
              "institution",
            ),
          },
        },
      },
      overdraft_limit: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: 0.0,
        validate: {
          isFloat: {
            msg: errorConsts.ERROR_NOT_NUMERIC.replace(
              "{placeholder}",
              "overdraft_limit",
            ),
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
