const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Expense = require("../models").Expense;
const { expenseSchema } = require("../validators/expense-validator");
const { validateUserId } = require("../validators/user-validator");
const { ApiValidationError } = require("../errors/validation-errors");
const errorConstants = require("../constants/error-constants");
const TransactionService = require("../services/transaction-service");

/**
 * Class responsible for providing expense-related services.
 */
class ExpenseService {
  /**
   * Get all expenses of a specific user.
   *
   * @param {number} userId - The ID of the user to filter expenses.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's expenses.
   */
  static async getAll(userId) {
    await validateUserId(userId);

    return await Expense.findAll({
      where: {
        userId: Number(userId),
      },
    });
  }

  /**
   * Get a specific expense based on the ID and user ID.
   *
   * @param {number} id - The ID of the expense.
   * @param {number} userId - The ID of the user who owns the expense.
   * @returns {Promise<Object>} A Promise that resolves to the found expense object.
   */
  static async getById(id, userId) {
    await validateUserId(userId);

    return await Expense.findOne({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
  }

  /**
   * Create a new expense.
   *
   * @param {Object} expense - The expense object to be created.
   * @param {number} userId - The ID of the user who owns the expense.
   * @returns {Promise<Object>} A Promise that resolves to the created expense object.
   */
  static async create(expense, userId) {
    expense = { ...expense, userId: userId };

    await expenseSchema
      .validate(expense, { abortEarly: false })
      .catch((err) => {
        throw new ApiValidationError(
          errorConstants.MSG_VALIDATION_ERROR,
          err.message,
        );
      });

    const createdExpense = await Expense.create(expense).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );

    if (createdExpense.isPaid) {
      return await TransactionService.createFromExpense(createdExpense)
        .then((createdTransaction) => {
          return {
            createdExpense: createdExpense,
            accountTransaction: createdTransaction,
          };
        })
        .catch(async (err) => {
          /**
           * If the amount overpass the account overdraftLimit this exception will occours
           * in this way the expense will be set as unpaid but still created.
           */
          if (err.name === "AccountBalanceError") {
            createdExpense.isPaid = false;
            await createdExpense.save();
            return {
              createdExpense: createdExpense,
              info: err.message,
            };
          } else throw err;
        });
    }

    return createdExpense;
  }

  /**
   * Update an existing expense based on the ID and user ID.
   *
   * @param {Object} expense - The expense object to be updated.
   * @param {number} id - The ID of the expense to be updated.
   * @param {number} userId - The ID of the user who owns the expense.
   * @returns {Promise<Object>} A Promise that resolves to the updated expense object.
   */
  static async updateById(expense, id, userId) {
    await expenseSchema
      .validate(expense, { abortEarly: false, stripUnknown: true })
      .catch((err) => {
        throw new ApiValidationError(
          errorConstants.MSG_VALIDATION_ERROR,
          err.message,
        );
      });

    const dbTransaction = sequelize.transaction();

    const updatedExpense = await Expense.update(expense, {
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    })
      .then(async () => {
        return await this.getById(id, userId);
      })
      .catch((err) => {
        SequelizeErrorWrapper.wrapError(err);
      });
  }

  /**
   * Delete an existing expense based on the ID and user ID.
   *
   * @param {number} id - The ID of the expense to be deleted.
   * @param {number} userId - The ID of the user who owns the expense.
   * @returns {Promise<number>} A Promise that resolves with the number of deleted rows (0 or 1).
   */
  static async deleteById(id, userId) {
    await validateUserId(userId);

    return await Expense.destroy({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
  }
}

module.exports = ExpenseService;
