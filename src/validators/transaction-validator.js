const ErrorMessageFormatter = require("../helpers/error-message-formatter");
const TransactionTypesEnum = require("../enums/transaction-types-enum");
const Yup = require("yup");
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

  transaction_type: Yup.string().oneOf(
    Object.values(TransactionTypesEnum),
    ErrorMessageFormatter.invalidEnum("transaction_type", TransactionTypesEnum),
  ),

  account_id: Yup.number()
    .required(ErrorMessageFormatter.requiredField("account_id"))
    .integer(ErrorMessageFormatter.notInteger("account_id"))
    .test("accountExists", accountConstants.MSG_NOT_FOUND, async () => {
      const { account_id } = this.parent;
      await AccountService.exists(account_id);
    }),

  user_id: Yup.number()
    .required(ErrorMessageFormatter.requiredField("user_id"))
    .integer(ErrorMessageFormatter.notInteger("user_id"))
    .test("userExists", userConstants.MSG_NOT_FOUND, async () => {
      const { user_id } = this.parent;
      await UserService.exists(user_id);
    }),
});

module.exports = { transactionSchema };
