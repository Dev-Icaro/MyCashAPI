const Yup = require("yup");
const ErrorMessageFormatter = require("../utils/error-message-formatter");
const TransactionTypesEnum = require("../enums/transaction-types-enum");
const accountConstants = require("../constants/account-constants");
const userConstants = require("../constants/user-constants");
const { yupAccountExists } = require("./account-validator");
const { yupUserExists } = require("./user-validator");

const transactionSchema = Yup.object().shape({
  amount: Yup.number().required(),
  date: Yup.date().required(),
  description: Yup.string().required(),
  transactionType: Yup.string()
    .oneOf(
      Object.values(TransactionTypesEnum),
      ErrorMessageFormatter.invalidEnum(
        "transactionType",
        TransactionTypesEnum,
      ),
    )
    .required(),
  accountId: Yup.number()
    .required()
    .integer()
    .test("accountExists", accountConstants.MSG_NOT_FOUND, yupAccountExists),
  userId: Yup.number()
    .required()
    .integer()
    .test("userExists", userConstants.MSG_NOT_FOUND, yupUserExists),
});

module.exports = { transactionSchema };
