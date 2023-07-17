const errorConsts = require("../constants/error-constants");
const accountConsts = require("../constants/account-constants");
const { param } = require("express-validator");
const AccountService = require("../services/account-service");

const validateAccountId = () => [
  param("id")
    .exists()
    .withMessage(errorConsts.ERROR_REQUIRED_PARAM.replace("{param}", "id"))
    .bail()
    .trim()
    .notEmpty()
    .withMessage(errorConsts.ERROR_EMPTY_FIELD.replace("{placeholder}", "id"))
    .bail()
    .isInt()
    .withMessage(errorConsts.ERROR_NOT_INT.replace("{placeholder}", "id"))
    .bail()
    .custom(async (id, { req }) => {
      const accountService = new AccountService(req.userId);
      if (!(await accountService.getAccountById(id)))
        throw new Error(accountConsts.ACCOUNT_NOT_FOUND);
    }),
];

module.exports = { validateAccountId };
