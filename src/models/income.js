"use strict";
const { Model } = require("sequelize");
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
      amount: DataTypes.DOUBLE,
      date: DataTypes.DATE,
      description: DataTypes.STRING,
      paymentMethod: DataTypes.STRING,
      receipt: DataTypes.STRING,
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
