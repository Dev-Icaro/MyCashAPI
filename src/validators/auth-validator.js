const { body } = require("express-validator");
const { ERROR_USER_NOT_FOUND } = require("../constants/user-constants.js");
const errorsConsts = require("../constants/error-constants.js");
const models = require("../models");
const User = models.User;

const validateSiginReq = () => [validateEmail(), validatePass()];

const validateResetPassReq = () => [
   validateEmail(),
   validatePass(),
   body("token")
      .exists()
      .withMessage(
         errorsConsts.ERROR_REQUIRED_FIELD.replace("{placeholder}", "token")
      )
      .bail()
      .isInt()
      .withMessage(
         errorsConsts.ERROR_NOT_INT.replace("{placeholder}", "token")
      ),
];

const validateEmail = () =>
   body("email")
      .exists()
      .withMessage(
         errorsConsts.ERROR_REQUIRED_FIELD.replace("{placeholder}", "email")
      )
      .bail()
      .trim()
      .notEmpty()
      .withMessage(
         errorsConsts.ERROR_EMPTY_FIELD.replace("{placeholder}", "email")
      )
      .bail()
      .isEmail()
      .withMessage(
         errorsConsts.ERROR_INVALID_FORMAT.replace("{placeholder}", "email")
      )
      .bail()
      .custom(async (value) => {
         if (!(await User.findUserByEmail(value))) throw ERROR_USER_NOT_FOUND;
      });

const validatePass = () => [
   body("password")
      .exists()
      .withMessage(
         errorsConsts.ERROR_REQUIRED_FIELD.replace("{placeholder}", "password")
      )
      .bail()
      .trim()
      .notEmpty()
      .withMessage(
         errorsConsts.ERROR_EMPTY_FIELD.replace("{placeholder}", "password")
      ),
];

module.exports = { validateSiginReq, validateEmail, validateResetPassReq };
