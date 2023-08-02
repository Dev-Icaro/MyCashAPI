const TransactionService = require("../services/transaction-service");
const TransactionTypesEnum = require("../enums/transaction-types-enum");

/**
 * Handle account balance error, putting the field isPaid to false,
 * and returning the expense with an info message about what occours.
 *
 * @param {AccountBalanceError} err - The Account balance error to handle.
 * @param {Expense} expense - The expense that involved on the operation.
 * @returns {Object} - An object containing the updated expense values and an info
 * message.
 */
async function handleAccountBalanceError(err, expense) {
  expense.isPaid = false;
  await expense.save();

  return {
    expense: expense,
    info: err.message,
  };
}

/**
 * Handle the change of isPaid field, this function must be called only
 * if the isPaid field was changed, it will create an transaction based on the
 * new value of the field.
 *
 * @param {Expense} expense - The expense that changed the isPaid field.
 */
async function handleExpenseIsPaidChange(expense) {
  let transactionType = expense.isPaid
    ? TransactionTypesEnum.WITHDRAWL
    : TransactionTypesEnum.DEPOSIT;

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

module.exports = { handleAccountBalanceError, handleExpenseIsPaidChange };
