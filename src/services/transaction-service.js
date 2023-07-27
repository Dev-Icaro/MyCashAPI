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

class TransactionService {
  /**
   * Create an account transaction.
   *
   * @param {Transaction} transaction - The account transaction that we
   * want to crate.
   * @param {Sequelize.transaction=} dbTransaction - The sequelize data base transaction
   * to assign if the method [optional]
   */
  static async create(transaction, dbTransaction) {
    await transactionSchema.validate(transaction).catch((err) => {
      throw new ApiValidationError(errorConstants.MSG_VALIDATION_ERROR, err);
    });

    try {
      if (dbTransaction) {
        await Transaction.create(transaction, { transaction: dbTransaction });
      } else {
        await Transaction.create(transaction);
      }

      await this.processTransaction(transaction);
    } catch (err) {
      SequelizeErrorWrapper.wrapError(err);
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
