const {
  validateIdParam,
  checkRequiredField,
} = require("../validators/generic-validator");
const ExpenseService = require("../services/expense-service");
const expenseConsts = require("../constants/expense-constants");
const categoryConsts = require("../constants/category-constants");
const accountConsts = require("../constants/account-constants");
const { param, body, checkSchema } = require("express-validator");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
const CategoryService = require("../services/category-service");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");

const validateExpenseIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    const expenseService = new ExpenseService(req.userId);
    if (!(await expenseService.getExpenseById(id))) {
      throw new Error(expenseConsts.EXPENSE_NOT_FOUND);
    }
  }),
];

module.exports = {
  validateExpenseIdParam,
};
