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
            msg: ErrorMessageFormatter.formatNotNullErr("amount"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("amount"),
          },
          isFloat: {
            msg: ErrorMessageFormatter.formatNotFloatErr("amount"),
          },
        },
      },
      date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date(),
        validate: {
          isDate: {
            msg: ErrorMessageFormatter.formatInvalidDateTimeErr("date"),
          },
        },
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("description"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("description"),
          },
        },
      },
      payment_method: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("payment_method"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("payment_method"),
          },
        },
      },
      account_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("account_id"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("account_id"),
          },
          isInt: {
            msg: ErrorMessageFormatter.formatNotIntegerErr("account_id"),
          },
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("user_id"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("user_id"),
          },
          isInt: {
            msg: ErrorMessageFormatter.formatNotIntegerErr("user_id"),
          },
        },
      },
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.formatNotNullErr("category_id"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.formatNotEmptyErr("category_id"),
          },
          isInt: {
            msg: ErrorMessageFormatter.formatNotIntegerErr("category_id"),
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
