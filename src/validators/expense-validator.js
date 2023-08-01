/**
 * Module representing expense validation and schema using Yup.
 * @module expenseValidator
 */

const { yupAccountExists } = require("./account-validator");
const { yupCategoryExists } = require("./category-validator");
const Yup = require("yup");
const categoryConstants = require("../constants/category-constants");
const accountConstants = require("../constants/account-constants");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const userConstants = require("../constants/user-constants");
const { yupUserExists } = require("./user-validator");
const ApiValidationResult = require("../helpers/api-validation-result");

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

/**
 * Get a specific property schema from the expense schema.
 * @function
 * @param {string} propName - Name of the property to retrieve from the expense schema.
 * @throws {ApiInvalidArgumentError} Throws an error if the property schema does not exist.
 * @returns {Yup.ObjectSchema} - The schema for the specified property.
 */
const getPropExpenseSchema = (propName) => {
  const propSchema = expenseSchema.fields[propName];

  if (!propSchema) {
    throw new ApiInvalidArgumentError(
      `Invalid schema for property: ${propName}`,
    );
  }

  return Yup.object().shape({
    [propName]: propSchema,
  });
};

/**
 * Validate the expense present properties.
 *
 * @async
 * @function
 * @param {object} expense - The expense object to be validated.
 * @returns {ApiValidationResult} - The validation result containing any errors found during validation.
 */
const validateExpensePresentProps = async (expense) => {
  let errors = new ApiValidationResult();
  for (let prop in expense) {
    await getPropExpenseSchema(prop)
      .validate(expense)
      .catch((err) => errors.addError(err.errors));
  }
  return errors;
};

module.exports = {
  expenseSchema,
  validateExpensePresentProps,
};
