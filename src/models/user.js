"use strict";
const { Model } = require("sequelize");
const { hashString } = require("../utils/crypt-utils");
const errorsConsts = require("../constants/error-constants");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static async findUserByEmail(email) {
      return await this.findOne({ where: { email: String(email) } });
    }

    static associate(models) {
      // define association here
      User.hasMany(models.Account, { foreignKey: "user_id" });

      User.hasMany(models.Transaction, { foreignKey: "user_id" });

      User.hasMany(models.Expense, { foreignKey: "user_id" });

      User.hasMany(models.Income, { foreignKey: "user_id" });

      User.hasMany(models.Category, { foreignKey: "user_id" });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("username"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("username"),
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("password"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("password"),
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("email"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("email"),
          },
          isEmail: {
            msg: ErrorMessageFormatter.invalidEmail(this.email),
          },
        },
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("first_name"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("first_name"),
          },
        },
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: ErrorMessageFormatter.notNull("last_name"),
          },
          notEmpty: {
            msg: ErrorMessageFormatter.notEmpty("last_name"),
          },
        },
      },
      birthday: DataTypes.DATE,
      address: DataTypes.STRING,
      resetToken: DataTypes.STRING,
      resetTokenExpiration: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    },
  );

  User.addHook("beforeCreate", async (user, options) => {
    user.password = await hashString(user.password);
  });

  User.addHook("beforeUpdate", async (user, options) => {
    if (user.changed("password")) {
      user.password = await hashString(user.password);
    }
  });

  return User;
};
