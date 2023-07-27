const { body } = require("express-validator");
const { MSG_NOT_FOUND } = require("../constants/user-constants.js");
const ErrorMessageFormatter = require("../utils/error-message-formatter.js");
const { ApiInvalidArgumentError } = require("../errors/argument-errors.js");
const UserService = require("../services/user-service.js");

const validateSiginReq = () => [validateEmail(), validatePass()];

const validateResetPassReq = () => [
  validateEmail(),
  validatePass(),
  body("token")
    .exists()
    .withMessage(ErrorMessageFormatter.notNull("token"))
    .bail()
    .isInt()
    .withMessage(ErrorMessageFormatter.notInteger("token")),
];

const validateEmail = () =>
  body("email")
    .exists()
    .withMessage(ErrorMessageFormatter.notNull("email"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ErrorMessageFormatter.notEmpty("email"))
    .bail()
    .isEmail()
    .withMessage((email, { req }) => ErrorMessageFormatter.invalidEmail(email))
    .bail()
    .custom(async (value) => {
      if (!(await UserService.findByEmail(value))) throw MSG_NOT_FOUND;
    });

const validatePass = () => [
  body("password")
    .exists()
    .withMessage(ErrorMessageFormatter.notNull("password"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ErrorMessageFormatter.notEmpty("password")),
];

module.exports = {
  validateSiginReq,
  validateEmail,
  validateResetPassReq,
};
