const Yup = require("yup");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
const TransactionTypesEnum = require("../enums/transaction-types-enum");
const UserService = require("../services/user-service");
const AccountService = require("../services/account-service");
const accountConstants = require("../constants/account-constants");
const userConstants = require("../constants/user-constants");

const transactionSchema = Yup.object().shape({
  amount: Yup.number(ErrorMessageFormatter.notNumeric("amount")).required(
    ErrorMessageFormatter.requiredField("amout"),
  ),

  date: Yup.date(ErrorMessageFormatter.invalidDateTime("date")).required(
    ErrorMessageFormatter.requiredField("date"),
  ),

  description: Yup.string().required(
    ErrorMessageFormatter.requiredField("description"),
  ),

  transactionType: Yup.string().oneOf(
    Object.values(TransactionTypesEnum),
    ErrorMessageFormatter.invalidEnum("transactionType", TransactionTypesEnum),
  ),

  /* accountId: Yup.number()
    .required(ErrorMessageFormatter.requiredField("accountId"))
    .integer(ErrorMessageFormatter.notInteger("accountId"))
    .test("accountExists", accountConstants.MSG_NOT_FOUND, async () => {
      const { accountId, userId } = this.parent;
      await AccountService.exists(accountId, userId);
    }),

  userId: Yup.number()
    .required(ErrorMessageFormatter.requiredField("userId"))
    .integer(ErrorMessageFormatter.notInteger("userId"))
    .test("userExists", userConstants.MSG_NOT_FOUND, async () => {
      const { userId } = this.parent;
      await UserService.exists(userId);
    }), */
});

module.exports = { transactionSchema };
