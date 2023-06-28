'use strict';
const {
  Model
} = require('sequelize');
const { hashString } = require('../utils/bcrypt-utils');
const errorsConsts = require('../constants/error-constants');

module.exports = (sequelize, DataTypes) => {
  class EmailConfig extends Model {

    static async getEmailConfigById(id) {
      return await this.findOne({ where: { id: Number(id) }});
    }
    
    static associate(models) {
      // define association here
    }
  }
  EmailConfig.init({
    server: { 
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'server')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'server')
        }
      }
    },
    port: { 
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'port')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'port')
        },
        isNumeric: {
          msg: errorsConsts.ERROR_NOT_NUMERIC.replace('{placeholder}', 'port')
        }
      }
    },
    username: {
      type: DataTypes.STRING,
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
    useSSL: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'useSSL')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'useSSL')
        }
      }
    },
    useTLS: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        notNull: {
          msg: errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'useTLS')
        },
        notEmpty: {
          msg: errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'useTLS')
        }
      }
    } 
  }, {
    sequelize,
    modelName: 'EmailConfig',
  });

  EmailConfig.addHook('beforeCreate', async (emailConfig, options) => {
    emailConfig.password = await hashString(emailConfig.password);
  });

  EmailConfig.addHook('beforeUpdate', async (emailConfig, options) => {
    if (EmailConfig.changed('password')) {
      emailConfig.password = await hashString(emailConfig.password);
    }
  });

  return EmailConfig;
};