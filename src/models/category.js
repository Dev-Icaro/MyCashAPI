"use strict";
const { Model } = require("sequelize");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Category.hasMany(models.Expense, { foreignKey: "categoryId" });

      Category.hasMany(models.Income, { foreignKey: "categoryId" });

      Category.belongsTo(models.User, { foreignKey: "userId" });
    }
  }
  Category.init(
    {
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
    },
    {
      sequelize,
      modelName: "Category",
    },
  );
  return Category;
};
