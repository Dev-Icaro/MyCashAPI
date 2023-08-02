const AccountService = require("../services/account-service");
const accountConsts = require("../constants/account-constants");

/**
 * Account Controller
 *
 * This controller is responsible for handling API requests related to bank accounts.
 */
class AccountController {
  /**
   * Get all bank accounts.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Account} - JSON containing all user accounts.
   */
  static async getAll(req, res, next) {
    try {
      const accounts = await AccountService.getAll(req.userId);
      return res.status(200).json(accounts);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Get a bank account by ID.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Account} - JSON containing the requested account.
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const account = await AccountService.getById(id, req.userId);
      return res.status(200).json(account);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Create a bank account.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Account} - JSON containing the created account.
   */
  static async create(req, res, next) {
    try {
      const createdAccount = await AccountService.create(req.body, req.userId);
      return res.status(200).json(createdAccount);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Update a bank account by ID.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Account} - JSON containing the updated information.
   */
  static async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const updatedAccount = await AccountService.updateById(
        req.body,
        id,
        req.userId,
      );
      return res.status(200).json(updatedAccount);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Delete a bank account by ID.
   *
   * @param {Express.Request} req - The Express request object.
   * @param {Express.Response} res - The Express response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {string} - Success message for deleted account.
   */
  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      await AccountService.deleteById(id, req.userId);
      return res.status(200).json({
        message: accountConsts.MSG_DELETED.replace("{placeholder}", id),
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AccountController;
