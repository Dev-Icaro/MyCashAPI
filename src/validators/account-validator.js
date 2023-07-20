const errorConsts = require("../constants/error-constants");
const accountConsts = require("../constants/account-constants");
const { param } = require("express-validator");
const AccountService = require("../services/account-service");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");

const validateAccountId = () => [
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
      const accountService = new AccountService(req.userId);
      if (!(await accountService.getAccountById(id)))
        throw new Error(accountConsts.MSG_NOT_FOUND);
    }),
];

module.exports = { validateAccountId };
