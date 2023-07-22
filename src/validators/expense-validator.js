const { validateIdParam } = require("../validators/generic-validator");
const ExpenseService = require("../services/expense-service");
const expenseConsts = require("../constants/expense-constants");
const { param } = require("express-validator");

const validateExpenseIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    if (!(await ExpenseService.getById(id, req.userId))) {
      throw new Error(expenseConsts.MSG_NOT_FOUND);
    }
  }),
];

module.exports = {
  validateExpenseIdParam,
};
