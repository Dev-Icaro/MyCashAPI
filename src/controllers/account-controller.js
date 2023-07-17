const AccountService = require("../services/account-service");
const logger = require("../utils/logger");
const accountConsts = require("../constants/account-constants");

/**
 * Account Controller
 *
 * Esse controller é responsável pelas requisições de contas bancárias
 * da API.
 */
class AccountController {
  /**
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {import("express").NextFunction} next
   * @returns {Account} - JSON contendo todas as contas do usuário.
   */
  static async getAllAccounts(req, res, next) {
    try {
      const accounts = await AccountService.getAllAccounts();
      return res.status(200).json(accounts);
    } catch (e) {
      next(e);
    }
  }

  static async getAccountById(req, res, next) {
    try {
      const { id } = req.params;
      const account = await AccountService.getAccountById(id);
      return res.status(200).json(account);
    } catch (e) {
      next(e);
    }
  }

  static async createAccount(req, res, next) {
    try {
      const createdAccount = await AccountService.createAccount(req.body);
      return res.status(200).json(createdAccount);
    } catch (e) {
      next(e);
    }
  }

  static async updateAccountById(req, res, next) {
    try {
      const updatedAccount = await AccountServcie.updateAccount(req.body);
      return res.status(200).json(updatedAccount);
    } catch (e) {
      next(e);
    }
  }

  static async deleteAccountById(req, res, next) {
    try {
      const { id } = req.params;
      await AccountService.deleteAccountById(id);
      return res
        .status(200)
        .json(accountConsts.ACCOUNT_DELETED.replace("{placeholder}", id));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AccountController;
