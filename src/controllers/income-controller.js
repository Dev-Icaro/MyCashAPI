const IncomeService = require("../services/income-service");

/**
 * Controller handling HTTP requests related to incomes in the application.
 */
class IncomeController {
  /**
   * Get all incomes for the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Array<Income>} A JSON object containing all user incomes.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getAll(req, res, next) {
    try {
      const { userId } = req;
      const incomes = await IncomeService.getAll(userId);

      return res.status(200).json(incomes);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create a new income for the authenticated user.
   *
   * @param {Object} req - The Express request object containing the data of the income to be created.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Income} A JSON object containing the created income.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async create(req, res, next) {
    try {
      const { userId } = req;
      const createdIncome = await IncomeService.create(req.body, userId);

      res.status(200).json(createdIncome);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a specific income based on the ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Income} A JSON object containing the found income.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getById(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const income = await IncomeService.getById(id, userId);

      return res.status(200).json(income);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all incomes associated with the specified account ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Array<Income>} A JSON object containing all user incomes associated with the account ID.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getByAccountId(req, res, next) {
    try {
      const { accountId } = req.params;
      const { userId } = req;

      const income = await IncomeService.getByAccountId(accountId, userId);

      return res.status(200).json(income);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all incomes associated with the specified category ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Array<Income>} A JSON object containing all user incomes associated with the category ID.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { userId } = req;

      const income = await IncomeService.getByCategoryId(categoryId, userId);

      return res.status(200).json(income);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get all incomes by Account ID, Category ID, related to the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Array<Income>} A JSON object containing all incomes matched.
   */
  static async getByAccountIdAndCategoryId(req, res, next) {
    try {
      const { accountId, categoryId } = req.params;
      const { userId } = req;

      const incomes = await IncomeService.getByAccountIdAndCategoryId(
        accountId,
        categoryId,
        userId,
      );

      return res.status(200).json(incomes);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update an existing income based on the ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object containing the data of the income to be updated.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {Income} A JSON object containing the updated income.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async updateById(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const updatedIncome = await IncomeService.updateById(
        req.body,
        id,
        userId,
      );

      return res.status(200).json(updatedIncome);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete an existing income based on the ID and the ID of the authenticated user.
   *
   * @param {Object} req - The Express request object.
   * @param {Object} res - The Express response object.
   * @param {Function} next - The next middleware in the chain.
   * @returns {string} Message indicating that the income was deleted.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async deleteById(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;

      await IncomeService.deleteById(id, userId);

      return res.status(200).json({ message: "Income deleted with success" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = IncomeController;
