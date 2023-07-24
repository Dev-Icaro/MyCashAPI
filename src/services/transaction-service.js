const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");

const Transaction = require("../models").Transaction;

class TransactionService {
  static async createTransaction(transaction) {
    // Valida transaction format.

    if (transaction.transaction_type) {
    }

    return await Transaction.create(transaction).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }
}
