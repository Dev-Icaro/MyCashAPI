const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Expense = require("../models").Expense;
const {
  handleAccountBalanceError,
  handleIsPaidChange,
} = require("../helpers/expense-helpers");
const {
  expenseSchema,
  validateExpensePresentProps,
} = require("../validators/expense-validator");
const {
  ApiValidationError,
  ApiNotFoundError,
} = require("../errors/validation-errors");
const errorConstants = require("../constants/error-constants");
const TransactionService = require("../services/transaction-service");
const TransactionTypesEnum = require("../enums/transaction-types-enum");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const ErrorMessageFormatter = require("../utils/error-message-formatter");
const expenseConstants = require("../constants/expense-constants");

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

    const errors = await validateExpensePresentProps(expense);
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

    const expense = await this.getById(id, userId);
    if (!expense) throw new ApiNotFoundError(expenseConstants.MSG_NOT_FOUND);

    // Create an deposit if the expense that has bee deleted was paid.
    if (expense.isPaid) {
      TransactionService.createFromExpense(
        expense,
        TransactionTypesEnum.DEPOSIT,
      );
    }

    return await Expense.destroy({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
  }

  /**
   * Get expenses by account ID.
   *
   * @param {number} accountId - The ID of the account to filter expenses.
   * @param {number} userId - The ID of the user who owns the expenses.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's expenses for the specified account.
   */
  static async getByAccountId(accountId, userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    if (!accountId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("accountId"),
      );

    return await Expense.findAll({
      where: {
        accountId: Number(accountId),
        userId: Number(userId),
      },
    });
  }

  /**
   * Get expenses by category ID.
   *
   * @param {number} categoryId - The ID of the category to filter expenses.
   * @param {number} userId - The ID of the user who owns the expenses.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's expenses for the specified category.
   */
  static async getByCategoryId(categoryId, userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    if (!categoryId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("categoryId"),
      );

    return await Expense.findAll({
      where: {
        categoryId: Number(categoryId),
        userId: Number(userId),
      },
    });
  }

  /**
   * Get expenses by both account ID and category ID.
   *
   * @param {number} accountId - The ID of the account to filter expenses.
   * @param {number} categoryId - The ID of the category to filter expenses.
   * @param {number} userId - The ID of the user who owns the expenses.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's expenses for the specified account and category.
   */
  static async getByAccountIdAndCategoryId(accountId, categoryId, userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    if (!categoryId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("categoryId"),
      );

    if (!accountId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("accountId"),
      );

    return await Expense.findAll({
      where: {
        accountId: Number(accountId),
        categoryId: Number(categoryId),
        userId: Number(userId),
      },
    });
  }
}

module.exports = ExpenseService;
