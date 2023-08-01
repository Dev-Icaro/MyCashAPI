const TransactionService = require("../services/transaction-service");
const TransactionTypesEnum = require("../enums/transaction-types-enum");

async function handleAccountBalanceError(err, expense) {
  expense.isPaid = false;
  await expense.save();

  return {
    expense: expense,
    info: err.message,
  };
}

async function handleIsPaidChange(expense) {
  let transactionType;

  if (expense.isPaid) {
    transactionType = TransactionTypesEnum.WITHDRAWL;
  } else {
    transactionType = TransactionTypesEnum.DEPOSIT;
  }

  await TransactionService.createFromExpense(expense, transactionType).catch(
    async (err) => {
      /**
       * If the amount overpass the account overdraftLimit this exception will occours
       * in this way the expense will be set as unpaid but still created.
       */
      if (err.name === "AccountBalanceError") {
        return await handleAccountBalanceError(err, expense);
      } else throw err;
    },
  );
}

module.exports = { handleAccountBalanceError, handleIsPaidChange };
