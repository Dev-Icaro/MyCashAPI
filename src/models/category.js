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
      Category.hasMany(models.Expense, { foreignKey: "category_id" });

      Category.hasMany(models.Income, { foreignKey: "category_id" });

      Category.belongsTo(models.User, { foreignKey: "user_id" });
    }
  }
  Category.init(
    {
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
    },
    {
      sequelize,
      modelName: "Category",
    },
  );
  return Category;
};
