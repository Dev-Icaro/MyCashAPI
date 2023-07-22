"use strict";
const { Model } = require("sequelize");
const { formatMySqlDateTime } = require("../utils/date-utils");

const ErrorMessageFormatter = require("../helpers/error-message-formatter");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expense.belongsTo(models.User, { foreignKey: "user_id" });

      Expense.belongsTo(models.Account, { foreignKey: "account_id" });

      Expense.belongsTo(models.Category, { foreignKey: "category_id" });
    }
  }
  Expense.init(
    {
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("amount"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("amount"),
          },
          isFloat: {
            msg: ErrorMessageFormatter.notFloat("amount"),
          },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
        validate: {
          isDate: {
            msg: ErrorMessageFormatter.invalidDateTime("date"),
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("description"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("description"),
          },
        },
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("payment_method"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("payment_method"),
          },
        },
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("account_id"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("account_id"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("account_id"),
          },
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("user_id"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("user_id"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("user_id"),
          },
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("category_id"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("category_id"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("category_id"),
          },
        },
      },
      is_paid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      receipt: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Expense",
    },
  );
  return Expense;
};
