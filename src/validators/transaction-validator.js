const { checkSchema } = require("express-validator");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
const TransactionTypesEnum = require("../enums/transaction-types-enum");

const transactionSchema = {
  amount: {
    notEmpty: {
      errorMessage: ErrorMessageFormatter.requiredField("amount"),
    },
    isFloat: {
      errorMessage: ErrorMessageFormatter.notFloat("amout"),
    },
  },
  date: {
    notEmpty: {
      errorMessage: ErrorMessageFormatter.requiredField("date"),
    },
    isDate: {
      errorMessage: ErrorMessageFormatter.invalidDateTime("date"),
    },
  },
  description: {
    notEmpty: {
      errorMessage: ErrorMessageFormatter.requiredField("description"),
    },
  },
  transaction_type: {
    notEmpty: {
      errorMessage: ErrorMessageFormatter.requiredField("transaction_type"),
    },
    isIn: {
      options: Object.values(TransactionTypesEnum),
      errorMessage: ErrorMessageFormatter.invalidEnum(
        "transaction_type",
        TransactionTypesEnum,
      ),
    },
  },
};

const validateTransaction = checkSchema(transactionSchema);

module.exports = { validateTransaction };
