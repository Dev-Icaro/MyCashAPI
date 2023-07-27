const ExpenseService = require("../services/expense-service");
const { validateIdParam } = require("../validators/generic-validator");
const { param } = require("express-validator");
const { yupAccountExists } = require("./account-validator");
const { yupUserExists } = require("./user-validator");
const { yupCategoryExists } = require("./category-validator");
const Yup = require("yup");
const expenseConsts = require("../constants/expense-constants");
const userConstants = require("../constants/user-constants");
const categoryConstants = require("../constants/category-constants");
const accountConstants = require("../constants/account-constants");

const validateExpenseIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    if (!(await ExpenseService.getById(id, req.userId))) {
      throw new Error(expenseConsts.MSG_NOT_FOUND);
    }
  }),
];

const expenseSchema = Yup.object().shape({
  amount: Yup.number().required(),
  date: Yup.date().optional(),
  description: Yup.string().required(),
  paymentMethod: Yup.string().required(),
  receipt: Yup.string().optional(),
  userId: Yup.number()
    .required()
    .integer()
    .test("userExists", userConstants.MSG_NOT_FOUND, yupUserExists),
  categoryId: Yup.number()
    .required()
    .integer()
    .test("categoryExists", categoryConstants.MSG_NOT_FOUND, yupCategoryExists),
  accountId: Yup.number()
    .required()
    .integer()
    .test("accountExists", accountConstants.MSG_NOT_FOUND, yupAccountExists),
});

module.exports = {
  validateExpenseIdParam,
  expenseSchema,
};
