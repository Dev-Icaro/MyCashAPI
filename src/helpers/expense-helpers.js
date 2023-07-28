const TransactionService = require("../services/transaction-service");

async function createAccountTransactionFromExpense(expense) {
  return await TransactionService.create({
    amount: expense.amount,
    description: expense.description,
    transactionType: TransactionTypesEnum.WITHDRAWL,
    userId: expense.userId,
    accountId: expense.accountId,
  }).catch((err) => {
    throw err;
  });
}

module.exports = { createAccountTransactionFromExpense };
