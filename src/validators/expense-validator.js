const { yupAccountExists } = require("./account-validator");
const { yupCategoryExists } = require("./category-validator");
const Yup = require("yup");
const categoryConstants = require("../constants/category-constants");
const accountConstants = require("../constants/account-constants");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const userConstants = require("../constants/user-constants");
const { yupUserExists } = require("./user-validator");
const ApiValidationResult = require("../helpers/api-validation-result");

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

const validatePresentExpenseProps = async (expense) => {
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
  validatePresentExpenseProps,
};
