const TransactionTypesEnum = require("../enums/transaction-types-enum");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Transaction = require("../models").Transaction;
const { transactionSchema } = require("../validators/transaction-validator");
const AccountService = require("./account-service");
const Sequelize = require("sequelize");
const {
  ApiInvalidTransactionTypeError,
} = require("../errors/transaction-errors");
const { ApiValidationError } = require("../errors/validation-errors");
const errorConstants = require("../constants/error-constants");
const { sequelize } = require("../models");

class TransactionService {
  /**
   * Create an account transaction.
   * Obs: Be attempt that transaction is referent to account transaction and
   * dbTransaction is referent to the data base transaction.
   *
   * @param {Transaction} transaction - The account transaction that we
   * want to crate.
   * @param {Sequelize.transaction=} dbTransaction - The sequelize data base transaction
   * to assign with the method [optional]
   */
  static async create(transaction, dbTransaction) {
    await transactionSchema.validate(transaction).catch((err) => {
      throw new ApiValidationError(
        errorConstants.MSG_VALIDATION_ERROR,
        err.message,
      );
    });

    dbTransaction = dbTransaction || (await sequelize.transaction());

    try {
      const createdTransaction = await Transaction.create(transaction, {
        transaction: dbTransaction,
      });
      //await this.processTransaction(createdTransaction);

      await dbTransaction.commit();
      return createdTransaction;
    } catch (err) {
      SequelizeErrorWrapper.wrapError(err);
      await dbTransaction.rollback();
    }
  }

  static async processTransaction(transaction) {
    const { amount, accountId, userId } = transaction;

    try {
      switch (transaction.transactionType) {
        case TransactionTypesEnum.WITHDRAWL: {
          await AccountService.withdrawl(accountId, amount, userId);
          break;
        }
        case TransactionTypesEnum.DEPOSIT: {
          await AccountService.deposit(accountId, amount, userId);
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
