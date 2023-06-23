'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    
    static async findByEmail(email) {
      return await this.findOne({ where: { email: String(email) } });
    }

    static associate(models) {
      // define association here
      users.hasMany(models.account, 
        { foreignKey: 'user_id' });

      users.hasMany(models.transactions,
        { foreignKey: 'user_id' });

      users.hasMany(models.expenses,
        { foreignKey: 'user_id' });

      users.hasMany(models.income,
        { foreignKey: 'user_id' });
    }
  }
  users.init({
    username: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: true,
        // notNull: {
        //   msg: 'Missing required field username'
        // },
        // notEmpty: {
        //   msg: "Username cannot be empty"
        // }
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Missing required field password'
        },
        notEmpty: {
          msg: "password cannot be empty"
        }
      }
    },
    email: { 
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Missing required field email'
        },
        notEmpty: {
          msg: "Email cannot be empty"
        },
        isEmail: {
          msg: 'Invalid email format'
        }
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_name: { 
      type: DataTypes.STRING,
      allowNull: false
    },
    birthday: DataTypes.DATE,
    address: DataTypes.STRING,
    resetToken: DataTypes.STRING,
    resetTokenExpiration: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};