const { expenseSchema } = require("../validators/expense-validator");

// Just cloned the expenseSchema because its the same fields...
const incomeSchema = expenseSchema.clone();

module.exports = {
  incomeSchema,
};
