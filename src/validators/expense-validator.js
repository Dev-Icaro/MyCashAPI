const { validateIdParam } = require("../validators/generic-validator");
const ExpenseService = require("../services/expense-service");
const expenseConsts = require("../constants/expense-constants");
const { param } = require("express-validator");
const Yup = require("yup");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
const userConstants = require("../constants/user-constants");
const categoryConstants = require("../constants/category-constants");
const accountConstants = require("../constants/account-constants");
const UserService = require("../services/user-service");
const AccountService = require("../services/account-service");
const CategoryService = require("../services/category-service");

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
  payment_method: Yup.string().required(),
  receipt: Yup.string().optional(),
  user_id: Yup.number()
    .required()
    .integer()
    .test("userExists", userConstants.MSG_NOT_FOUND, async (userId) => {
      await UserService.exists(userId);
    }),
  category_id: Yup.number()
    .required()
    .integer()
    .test(
      "categoryExists",
      categoryConstants.MSG_NOT_FOUND,
      async (categoryId) => {
        await CategoryService.exists(categoryId, this.parent.user_id);
      },
    ),
  account_id: Yup.number()
    .required()
    .integer()
    .test(
      "accountExists",
      accountConstants.MSG_NOT_FOUND,
      async (accountId) => {
        await AccountService.exists(accountId, this.parent.user_id);
      },
    ),
});

module.exports = {
  validateExpenseIdParam,
  expenseSchema,
};
