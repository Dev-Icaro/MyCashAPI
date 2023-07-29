const TransactionTypesEnum = require("../enums/transaction-types-enum");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Transaction = require("../models").Transaction;
const { transactionSchema } = require("../validators/transaction-validator");
const AccountService = require("./account-service");
const {
  ApiInvalidTransactionTypeError,
} = require("../errors/transaction-errors");
const { ApiValidationError } = require("../errors/validation-errors");
const errorConstants = require("../constants/error-constants");
const { sequelize } = require("../models");

class TransactionService {
  /**
   * Create an account transaction.
   *
   * @param {Transaction} transaction - The account transaction that we
   * want to create.
   */
  static async create(transaction) {
    await transactionSchema.validate(transaction).catch((err) => {
      throw new ApiValidationError(
        errorConstants.MSG_VALIDATION_ERROR,
        err.message,
      );
    });

    const t = await sequelize.transaction();

    return await Transaction.create(transaction, { transaction: t })
      .then(async (createdTransaction) => {
        await this.processTransaction(createdTransaction, t);
        await t.commit();
        return createdTransaction;
      })
      .catch(async (err) => {
        await t.rollback();
        SequelizeErrorWrapper.wrapError(err);
      });
  }

  /**
   * Create an Account transaction based in a Expense.
   *
   * @param {Expense} expense - The expense that we want to create a transaction from.
   * @returns {Transaction} - The created account transaction.
   */
  static async createFromExpense(expense) {
    const transaction = {
      amount: expense.amount,
      description: expense.description,
      transactionType: TransactionTypesEnum.WITHDRAWL,
      userId: expense.userId,
      accountId: expense.accountId,
    };

    return await this.create(transaction);
  }

  /**
   * Process an Transaction, performing the correct account operations based
   * in the transaction type.
   *
   * @param {Transaction} transaction - The transaction that we want to process.
   * @param {sequelize.Transaction} sequelizeTransaction - The database transaction to apply
   * atomicity for operations linking them to the it.
   * @returns {void}
   */
  static async processTransaction(transaction, sequelizeTransaction) {
    const { amount, accountId, userId } = transaction;

    try {
      switch (transaction.transactionType) {
        case TransactionTypesEnum.WITHDRAWL: {
          await AccountService.withdrawl(
            accountId,
            amount,
            userId,
            sequelizeTransaction,
          );
          break;
        }
        case TransactionTypesEnum.DEPOSIT: {
          await AccountService.deposit(
            accountId,
            amount,
            userId,
            sequelizeTransaction,
          );
          break;
        }
        default: {
          throw new ApiInvalidTransactionTypeError(
            "Invalid Transaction type while creating transaction",
          );
        }
      }
    } catch (err) {
      throw err;
    }
  }
}

module.exports = TransactionService;
