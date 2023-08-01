/**
 * Module representing expense validation and schema using Yup.
 * @module expenseValidator
 */

const { yupAccountExists } = require("./account-validator");
const { yupCategoryExists } = require("./category-validator");
const Yup = require("yup");
const categoryConstants = require("../constants/category-constants");
const accountConstants = require("../constants/account-constants");
const userConstants = require("../constants/user-constants");
const { yupUserExists } = require("./user-validator");

/**
 * Expense schema using Yup for validation.
 * @type {Yup.ObjectSchema}
 */
const expenseSchema = Yup.object().shape({
  amount: Yup.number().required(),
  date: Yup.date().optional(),
  description: Yup.string().required(),
  paymentMethod: Yup.string().required(),
  receipt: Yup.string().optional(),
  isPaid: Yup.boolean().optional(),
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
  expenseSchema,
};
