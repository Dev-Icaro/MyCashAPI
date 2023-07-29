"use strict";
const { Model } = require("sequelize");
const ErrorMessageFormatter = require("../utils/error-message-formatter");

module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    async addToBalance(amount, sequelizeTransaction) {
      this.balance += amount;
      return await this.save({ transaction: sequelizeTransaction });
    }

    async subtractToBalance(amount, sequelizeTransaction) {
      this.balance -= amount;
      return await this.save({ transaction: sequelizeTransaction });
    }

    hasOverdraftLimit() {
      return this.overdraftLimit != null ? true : false;
    }

    amountExceedOverdraftLimit(amount) {
      return this.balance - amount < this.overdraftLimit;
    }

    static associate(models) {
      // define association here
      Account.hasMany(models.Transaction, { foreignKey: "accountId" });

      Account.hasMany(models.Expense, { foreignKey: "accountId" });

      Account.hasMany(models.Income, { foreignKey: "accountId" });

      Account.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Account.init(
    {
      accountHolderName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("accountNumber"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("accountNumber"),
          },
          isInt: {
            msg: ErrorMessageFormatter.notInteger("accountNumber"),
          },
        },
      },
      accountType: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("accountType"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notNull("accountType"),
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
      lastTransaction: DataTypes.DATE,
      status: {
        type: DataTypes.STRING,
        defaultValue: "active",
        validate: {
          isAlpha: {
            msg: ErrorMessageFormatter.invalidFormat("status"),
          },
        },
      },
      institution: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("institution"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("institution"),
          },
        },
      },
      overdraftLimit: {
        type: DataTypes.DOUBLE,
        allowNull: true,
        defaultValue: null,
        validate: {
          isFloat: {
            msg: ErrorMessageFormatter.notFloat("overdraftLimit"),
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
