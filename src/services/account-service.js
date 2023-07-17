const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const { ERROR_MISSING_ARGUMENT } = require("../constants/error-constants");
const models = require("../models");
const Account = models.Account;

/**
 * Serviço de contas bancárias.
 */
class AccountService {
  /**
   * Cria uma instância de AccountService
   *
   * @param {integer} userId - Id do usuário que iremos efetuar as operações
   */
  constructor(userId) {
    if (!userId) {
      throw new ApiInvalidArgumentError(
        ERROR_MISSING_ARGUMENT,
        "userId in AccountService",
      );
    }

    this.userId = userId;
  }

  /**
   * Pega todas as contas do usuário.
   *
   * @returns {Account} - JSON contendo as contas bancárias do usuário.
   */
  async getAllAccounts() {
    return await Account.findAll({
      where: {
        user_id: Number(this.userId),
      },
    });
  }

  /**
   * Retorna uma conta do usuário pelo id.
   *
   * @param {integer} id - Id da conta do usuário.
   * @returns {Account}
   */
  async getAccountById(id) {
    return await Account.findOne({
      where: {
        user_id: Number(this.userId),
        id: Number(id),
      },
    });
  }

  /**
   * Cria uma conta bancária vinculada ao usuário.
   *
   * @param {Account} account - JSON contendo as informações necessárias
   * para a criação da conta.
   * @returns {Account} - JSON contendo a conta bancária criada.
   */
  async createAccount(account) {
    account.user_id = this.userId;

    return await Account.create(account)
      .then((createdAccount) => {
        return createdAccount;
      })
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Atualiza uma conta bancária do usuário pelo ID.
   *
   * @param {Account} updatedAccount - Dados que desejamos atualizar na conta.
   * @param {integer} id - Id da conta que desejamos atualizar.
   * @returns {Account} - Dados atualizados da conta.
   */
  async updateAccountById(updatedAccount, id) {
    return await Account.update(updatedAccount, {
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    })
      .then(async () => {
        return await this.getAccountById(id);
      })
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Deleta uma conta bancária do usuário.
   *
   * @param {integer} id - Id da conta que desejamos deletar.
   */
  async deleteAccountById(id) {
    await Account.destroy({
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    });
  }
}

module.exports = AccountService;
