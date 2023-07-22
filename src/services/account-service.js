const accountConsts = require("../constants/account-constants");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Account = require("../models").Account;
const { validateUserId } = require("../validators/auth-validator");

/**
 * Serviço de contas bancárias.
 */
class AccountService {
  /**
   * Obtém todas as contas bancárias associadas a um determinado usuário.
   *
   * @param {number} userId - O ID do usuário proprietário das contas.
   * @returns {Promise<Array>} Uma promise que resolve para uma lista de contas bancárias.
   */
  static async getAll(userId) {
    await validateUserId(userId);

    return await Account.findAll({
      where: {
        user_id: Number(userId),
      },
    });
  }

  /**
   * Obtém os detalhes de uma conta bancária específica com base no ID da conta e no ID do usuário proprietário.
   *
   * @param {number} id - O ID da conta bancária a ser buscada.
   * @param {number} userId - O ID do usuário proprietário da conta.
   * @returns {Promise<Object>} Uma promise que resolve para os detalhes da conta bancária encontrada.
   */
  static async getById(id, userId) {
    await validateUserId(userId);

    return await Account.findOne({
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    });
  }

  /**
   * Cria uma nova conta bancária associada a um usuário.
   *
   * @param {Object} account - Um objeto contendo as informações da nova conta bancária.
   * @param {number} userId - O ID do usuário proprietário da nova conta.
   * @returns {Promise<Object>} Uma promise que resolve para os detalhes da nova conta criada.
   */
  static async create(account, userId) {
    await validateUserId(userId);

    return await Account.create({ ...account, user_id: userId }).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }

  /**
   * Atualiza os detalhes de uma conta bancária existente com base no ID da conta e do usuário proprietário.
   *
   * @param {Object} account - Um objeto contendo as informações atualizadas da conta bancária.
   * @param {number} id - O ID da conta bancária a ser atualizada.
   * @param {number} userId - O ID do usuário proprietário da conta.
   * @returns {Promise<Object>} Uma promise que resolve para os detalhes atualizados da conta bancária.
   */
  static async updateById(account, id, userId) {
    await validateUserId(userId);

    return await Account.update(account, {
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    })
      .then(async () => await this.getById(id, userId))
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Exclui uma conta bancária existente com base no ID da conta e do usuário proprietário.
   *
   * @param {number} id - O ID da conta bancária a ser excluída.
   * @param {number} userId - O ID do usuário proprietário da conta.
   * @returns {Promise<boolean>} Uma promise que resolve para verdadeiro (true) se a conta foi excluída com sucesso.
   */
  static async deleteById(id, userId) {
    await validateUserId(userId);

    return await Account.destroy({
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    }).catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Aumenta o saldo de uma conta bancária específica.
   *
   * @param {number} accountId - O ID da conta bancária cujo saldo será aumentado.
   * @param {number} amount - O valor a ser adicionado ao saldo atual da conta.
   * @param {number} userId - O ID do usuário proprietário da conta.
   * @returns {Promise<number>} Uma promise que resolve para o novo saldo atual da conta.
   * @throws {Error} Lança um erro se a conta não for encontrada.
   */
  static async increaseAccountBalance(accountId, amount, userId) {
    await validateUserId(userId);

    const account = await this.getById(accountId);
    if (!account) {
      throw new Error(accountConsts.MSG_NOT_FOUND);
    }

    return await account.addToBalance(amount);
  }
}

module.exports = AccountService;
