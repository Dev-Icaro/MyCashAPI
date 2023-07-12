const errorConsts = require("../constants/error-constants");
const accountConsts = require("../constants/account-constants");
const models = require("../models");
const Account = models.Account;
const { param } = require("express-validator");

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
      .custom(async (id) => {
         if (!(await Account.getAccountById(id)))
            throw new Error(accountConsts.ACCOUNT_NOT_FOUND);
      }),
];

module.exports = { validateAccountId };
