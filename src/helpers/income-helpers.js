const TransactionTypesEnum = require("../enums/transaction-types-enum");
const TransactionService = require("../services/transaction-service");

async function createTransactionFromIncome(income, transactionType) {
  const transaction = {
    amount: income.amount,
    description: income.description,
    transactionType: transactionType,
    userId: income.userId,
    accountId: income.accountId,
  };

  return await TransactionService.create(transaction);
}

async function handleIncomeIsPaidChange(income) {
  let transactionType = income.isPaid
    ? TransactionTypesEnum.DEPOSIT
    : TransactionTypesEnum.WITHDRAWL;

  return await createTransactionFromIncome(income, transactionType);
}

/**
 * Handle account balance error, putting the field isPaid to false,
 * and returning the income with an info message about what occours.
 *
 * @param {AccountBalanceError} err - The Account balance error to handle.
 * @param {Income} expense - The income that involved on the operation.
 * @returns {Object} - An object containing the updated income values and an info
 * message.
 */
async function handleAccountBalanceError(err, income) {
  income.isPaid = false;
  await income.save();

  return {
    income: income,
    info: err.message,
  };
}

module.exports = {
  createTransactionFromIncome,
  handleIncomeIsPaidChange,
  handleAccountBalanceError,
};
