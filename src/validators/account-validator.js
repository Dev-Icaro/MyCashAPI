const { param } = require("express-validator");
const AccountService = require("../services/account-service");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");

/**
 * Use express validator to validate Account ID param in a request.
 * Obs: Validation result can be handled by the validationResultHandler.
 *
 * @returns {void}
 */
const validateAccountIdParam = () => [
  param("id")
    .exists()
    .withMessage()
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ErrorMessageFormatter.missingParam("id"))
    .bail()
    .isInt()
    .withMessage(ErrorMessageFormatter.notInteger("id"))
    .bail()
    .custom(async (id, { req }) => {
      await AccountService.exists(id, req.userId);
    }),
];

/**
 * Function used to validate an account ID in a Yup validation Schema
 * Obs: It could fail out of an Yup schema scope.
 *
 * @param {number} acccountId - The account ID to be validate, Yup will assign this variable
 * if you pass it as an argument in the test method.
 * @returns {boolean} - Yup convention to indicate that its valid.
 * @throws {Error} - Yup convention to indicate that its fail.
 */
const yupAccountExists = async function (accountId) {
  return await AccountService.exists(accountId, this.parent.userId);
};

module.exports = { validateAccountIdParam, yupAccountExists };
