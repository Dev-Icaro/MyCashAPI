const { body } = require("express-validator");
const { ERROR_USER_NOT_FOUND } = require("../constants/user-constants.js");
const errorsConsts = require("../constants/error-constants.js");
const models = require("../models");
const ErrorMessageFormatter = require("../helpers/error-message-formatter.js");
const User = models.User;

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
      if (!(await User.findUserByEmail(value))) throw ERROR_USER_NOT_FOUND;
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

module.exports = { validateSiginReq, validateEmail, validateResetPassReq };
