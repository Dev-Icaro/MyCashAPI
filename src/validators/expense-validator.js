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

const validateExpenseRequest = () => [
  validateExpenseIdParam(),
  //validateExpenseReqBody,
];

const validateExpenseIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    const expenseService = new ExpenseService(req.userId);
    if (!(await expenseService.getExpenseById(id))) {
      throw new Error(expenseConsts.EXPENSE_NOT_FOUND);
    }
  }),
];

const checkExpenseSchema = checkSchema({
  amount: {
    trim: true,
    // optional: {
    //   options: {
    //     nullable: true,
    //     errorMessage: ErrorMessageFormatter.requiredField("description"),
    //   },
    // },
    optional: false,
    isFloat: {
      errorMessage: ErrorMessageFormatter.notFloat("amount"),
    },
  },
  description: {
    optional: {
      options: {
        nullable: true,
        errorMessage: ErrorMessageFormatter.requiredField("description"),
      },
      trim: true,
    },
  },
  payment_method: {
    trim: true,
  },
  date: {
    optional: true,
    trim: true,
    notEmpty: {
      errorMessage: ErrorMessageFormatter.notEmpty("date"),
    },
    isDate: {
      errorMessage: ErrorMessageFormatter.invalidDateTime("date"),
    },
  },
  category_id: {
    optional: {
      options: {
        nullable: true,
        errorMessage: ErrorMessageFormatter.requiredField("description"),
      },
    },
    isInt: {
      errorMessage: ErrorMessageFormatter.notInteger("category_id"),
    },
    // custom: {
    //   options: async (category_id, { req }) => {
    //     const categoryService = new CategoryService(req.userId);
    //     if (!(await categoryService.getById(category_id))) {
    //       throw new ApiInvalidArgumentError(categoryConsts.MSG_NOT_FOUND);
    //     }
    //   },
    // },
  },
  account_id: {
    optional: {
      options: {
        nullable: true,
        errorMessage: ErrorMessageFormatter.requiredField("description"),
      },
    },
    isInt: {
      errorMessage: ErrorMessageFormatter.notInteger("account_id"),
    },
    // custom: {
    //   options: async (account_id, { req }) => {
    //     const accountService = new AccountService(req.userId);
    //     if (!(await accountService.getById(account_id))) {
    //       throw new ApiInvalidArgumentError(accountConsts.MSG_NOT_FOUND);
    //     }
    //   },
    // },
  },
});

module.exports = {
  validateExpenseIdParam,
  //validateExpenseReqBody,
  checkExpenseSchema,
  validateExpenseRequest,
};
