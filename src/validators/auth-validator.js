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
    .withMessage(ErrorMessageFormatter.formatNotNullErr("token"))
    .bail()
    .isInt()
    .withMessage(ErrorMessageFormatter.formatNotIntegerErr("token")),
];

const validateEmail = () =>
  body("email")
    .exists()
    .withMessage(ErrorMessageFormatter.formatNotNullErr("email"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ErrorMessageFormatter.formatNotEmptyErr("email"))
    .bail()
    .isEmail()
    .withMessage((email, { req }) =>
      ErrorMessageFormatter.formatInvalidEmailErr(email),
    )
    .bail()
    .custom(async (value) => {
      if (!(await User.findUserByEmail(value))) throw ERROR_USER_NOT_FOUND;
    });

const validatePass = () => [
  body("password")
    .exists()
    .withMessage(ErrorMessageFormatter.formatNotNullErr("password"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ErrorMessageFormatter.formatNotEmptyErr("password")),
];

module.exports = { validateSiginReq, validateEmail, validateResetPassReq };
