const { expenseSchema } = require("../validators/expense-validator");

const incomeSchema = expenseSchema.clone();

module.exports = {
  incomeSchema,
};
