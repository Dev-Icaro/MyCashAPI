"use strict";
const { Model } = require("sequelize");
const ErrorMessageFormatter = require("../utils/error-message-formatter");
module.exports = (sequelize, DataTypes) => {
  class Income extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Income.belongsTo(models.User, { foreignKey: "userId" });

      Income.belongsTo(models.Account, { foreignKey: "accountId" });

      Income.belongsTo(models.Category, { foreignKey: "categoryId" });
    }
  }
  Income.init(
    {
      amount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("amount"),
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
            msg: ErrorMessageFormatter.notEmpty("date"),
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
            msg: ErrorMessageFormatter.notEmpty("description"),
          },
        },
      },
      paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("paymentMethod"),
          },
        },
      },
      accountId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
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
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("categoryId"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("categoryId"),
          },
        },
      },
      receipt: {
        type: DataTypes.STRING,
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "Income",
    },
  );
  return Income;
};
