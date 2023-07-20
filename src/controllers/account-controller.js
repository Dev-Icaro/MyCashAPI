const AccountService = require("../services/account-service");
const accountConsts = require("../constants/account-constants");

/**
 * Account Controller
 *
 * Esse controller é responsável pelas requisições de contas bancárias
 * da API.
 */
class AccountController {
  /**
   * Pega todas as contas bancárias.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {import("express").NextFunction} next
   * @returns {Account} - JSON contendo todas as contas do usuário.
   */
  static async getAll(req, res, next) {
    try {
      const accountService = new AccountService(req.userId);
      const accounts = await accountService.getAll();

      return res.status(200).json(accounts);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Pega conta bancária pelo ID
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {import("express").NextFunction} next
   * @returns {Account} - JSON contendo a conta solicitada.
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const accountService = new AccountService(req.userId);
      const account = await accountService.getById(id);

      return res.status(200).json(account);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Cria conta bancária.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {import("express").NextFunction} next
   * @returns {Account} - JSON contendo a conta criada.
   */
  static async create(req, res, next) {
    try {
      const accountService = new AccountService(req.userId);
      const createdAccount = await accountService.create(req.body);

      return res.status(200).json(createdAccount);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Atualiza uma conta bancária pelo ID.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {import("express").NextFunction} next
   * @returns {Account} - JSON contendo as informações atualizadas.
   */
  static async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const accountService = new AccountService(req.userId);
      const updatedAccount = await accountService.updateById(req.body, id);

      return res.status(200).json(updatedAccount);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Deleta uma conta bancária pelo ID.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @param {import("express").NextFunction} next
   * @returns {string} - Mensagem de conta deletada com sucesso.
   */
  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const accountService = new AccountService(req.userId);
      await accountService.deleteById(id);

      return res
        .status(200)
        .json(accountConsts.ACCOUNT_DELETED.replace("{placeholder}", id));
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AccountController;
