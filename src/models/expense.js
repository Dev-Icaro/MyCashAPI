"use strict";
const { Model } = require("sequelize");
const { formatMySqlDateTime } = require("../utils/date-utils");

const ErrorMessageFormatter = require("../utils/error-message-formatter");
module.exports = (sequelize, DataTypes) => {
  class Expense extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Expense.belongsTo(models.User, { foreignKey: "userId" });

      Expense.belongsTo(models.Account, { foreignKey: "accountId" });

      Expense.belongsTo(models.Category, { foreignKey: "categoryId" });
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
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("paymentMethod"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("paymentMethod"),
          },
        },
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("accountId"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("accountId"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("accountId"),
          },
        },
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("userId"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("userId"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("userId"),
          },
        },
      },
      categoryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("categoryId"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("categoryId"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("categoryId"),
          },
        },
      },
      isPaid: {
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
