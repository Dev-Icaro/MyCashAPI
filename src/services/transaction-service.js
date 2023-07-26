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
  static async create(transaction) {
    transactionSchema.validate(transaction).catch((err) => {
      throw new ApiValidationError(errorConstants.MSG_VALIDATION_ERROR, err);
    });

    Sequelize.transaction(async (dbTransaction) => {
      try {
        await Transaction.create(transaction)
          .then(async () => {
            this.processTransaction(transaction);
          })
          .then(async () => await dbTransaction.commit());
      } catch (err) {
        await dbTransaction.rollback();
        SequelizeErrorWrapper.wrapError(err);
      }
    });
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
