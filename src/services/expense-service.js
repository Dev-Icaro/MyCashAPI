const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Expense = require("../models").Expense;
const {
  handleAccountBalanceError,
  handleIsPaidChange,
} = require("../helpers/expense-helpers");
const {
  expenseSchema,
  validatePresentExpenseProps,
} = require("../validators/expense-validator");
const { ApiValidationError } = require("../errors/validation-errors");
const errorConstants = require("../constants/error-constants");
const TransactionService = require("../services/transaction-service");
const TransactionTypesEnum = require("../enums/transaction-types-enum");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const ErrorMessageFormatter = require("../utils/error-message-formatter");

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
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

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
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

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
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    expense = { ...expense, userId: userId };

    await expenseSchema
      .strict()
      .validate(expense, { abortEarly: false })
      .catch((err) => {
        throw new ApiValidationError(
          errorConstants.MSG_VALIDATION_ERROR,
          err.errors,
        );
      });

    const createdExpense = await Expense.create(expense).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );

    if (createdExpense.isPaid) {
      await TransactionService.createFromExpense(
        createdExpense,
        TransactionTypesEnum.WITHDRAWL,
      ).catch(async (err) => {
        if (err.name === "AccountBalanceError") {
          return await handleAccountBalanceError(err, createdExpense);
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
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    expense = { ...expense, userId: userId };

    const errors = await validatePresentExpenseProps(expense);
    if (!errors.isEmpty())
      throw new ApiValidationError(
        errorConstants.MSG_VALIDATION_ERROR,
        errors.getErrors(),
      );

    const expenseBeforeUpdt = await this.getById(id, userId);

    await Expense.update(expense, {
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    }).catch((err) => {
      SequelizeErrorWrapper.wrapError(err);
    });

    const updatedExpense = await this.getById(id, userId);

    const hasChangedIsPaidField =
      expenseBeforeUpdt.isPaid !== updatedExpense.isPaid;

    if (hasChangedIsPaidField) {
      await handleIsPaidChange(updatedExpense);
    }

    return updatedExpense;
  }

  /**
   * Delete an existing expense based on the ID and user ID.
   *
   * @param {number} id - The ID of the expense to be deleted.
   * @param {number} userId - The ID of the user who owns the expense.
   * @returns {Promise<number>} A Promise that resolves with the number of deleted rows (0 or 1).
   */
  static async deleteById(id, userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    return await Expense.destroy({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
  }
}

module.exports = ExpenseService;
