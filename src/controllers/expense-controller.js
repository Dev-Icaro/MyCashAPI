const ExpenseService = require("../services/expense-service");
const expenseConsts = require("../constants/expense-constants");

/**
 * Controller handling HTTP requests related to expenses in the application.
 */
class ExpenseController {
  /**
   * Get all expenses for the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Array<Expense>} A JSON object containing all user expenses.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getAll(req, res, next) {
    try {
      const { userId } = req;
      const expenses = await ExpenseService.getAll(userId);

      return res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a specific expense based on the ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Expense} A JSON object containing the found expense.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      const expense = await ExpenseService.getById(id, userId);
      if (!expense) {
        return res.status(404).json({ message: expenseConsts.MSG_NOT_FOUND });
      }

      return res.status(200).json(expense);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create a new expense for the authenticated user.
   *
   * @param {Object} req - The Express request object containing the data of the expense to be created.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Expense} A JSON object containing the created expense.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async create(req, res, next) {
    try {
      const { userId } = req;

      const createdExpense = await ExpenseService.create(req.body, userId);

      return res.status(200).json(createdExpense);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update an existing expense based on the ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object containing the data of the expense to be updated.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Expense} A JSON object containing the updated expense.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      if (!(await ExpenseService.getById(id, userId))) {
        return res.status(404).json({ message: expenseConsts.MSG_NOT_FOUND });
      }

      const updatedExpense = await ExpenseService.updateById(
        req.body,
        id,
        userId,
      );

      return res.status(200).json(updatedExpense);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete an existing expense based on the ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {string} Message indicating that the expense was deleted.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const { userId } = req;

      await ExpenseService.deleteById(id, userId);

      return res.status(200).json(expenseConsts.MSG_DELETED);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all expenses associated with the specified account ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Array<Expense>} A JSON object containing all user expenses associated with the account ID.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getByAccountId(req, res, next) {
    try {
      const { accountId } = req.params;
      const { userId } = req;

      const expenses = await ExpenseService.getByAccountId(accountId, userId);

      return res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all expenses associated with the specified category ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Array<Expense>} A JSON object containing all user expenses associated with the category ID.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { userId } = req;

      const expenses = await ExpenseService.getByCategoryId(categoryId, userId);

      return res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all expenses by Account ID, Category ID, related to the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Object} next - The next middleware in the chain.
   * @returns {Array<Expense>} - A JSON object containing all expesnes matched.
   */
  static async getByAccountIdAndCategoryId(req, res, next) {
    try {
      const { accountId, categoryId } = req.params;
      const { userId } = req;

      const expenses = await ExpenseService.getByAccountIdAndCategoryId(
        accountId,
        categoryId,
        userId,
      );

      return res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExpenseController;
