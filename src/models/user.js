'use strict';
const {
  Model
} = require('sequelize');
const { hashString } = require('../utils/bcrypt-utils');
const errorsConsts = require('../constants/error-constants');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static async findByEmail(email) {
      return await this.findOne({ where: { email: String(email) } });
    }

    static associate(models) {
      // define association here
      User.hasMany(models.Account, 
        { foreignKey: 'user_id' });

      User.hasMany(models.Transaction,
        { foreignKey: 'user_id' });

      User.hasMany(models.Expense,
        { foreignKey: 'user_id' });

      User.hasMany(models.Income,
        { foreignKey: 'user_id' });
    }
  }
  User.init({
    username: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'username')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'username')
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'password')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'password')
        }
      }
    },
    email: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'email')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'email')
        },
        isEmail: {
          msg: errorsConsts.ERROR_INVALID_FORMAT.replace('{field}', 'email')
        }
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'first_name')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'first_name')
        }
      }
    },
    last_name: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'last_name')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'last_name')
        }
      }
    },
    birthday: DataTypes.DATE,
    address: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetTokenExpiration: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  
  User.addHook("beforeCreate", async(user, options) => {
    user.password = await hashString(user.password);
  });

  User.addHook("beforeUpdate", async(user, options) => {
    if (user.changed('password')) {
      user.password = await hashString(user.password);
    }
  });

  return User;
};