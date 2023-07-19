const { validateIdParam } = require("../validators/generic-validator");
const ExpenseService = require("../services/expense-service");
const expenseConsts = require("../constants/expense-constants");
const { param } = require("express-validator");

const validateExpenseIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    const expenseService = new ExpenseService(req.userId);
    if (!(await expenseService.getExpenseById(id))) {
      throw new Error(expenseConsts.EXPENSE_NOT_FOUND);
    }
  }),
];

module.exports = validateExpenseIdParam;
