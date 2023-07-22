const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Expense = require("../models").Expense;

/**
 * Classe responsável por fornecer serviços relacionados a despesas.
 */
class ExpenseService {
  /**
   * Obtém todas as despesas de um determinado usuário.
   *
   * @param {number} userId - O ID do usuário para filtrar as despesas.
   * @returns {Promise<Array>} Uma Promise que resolve em um array com todas as despesas do usuário.
   */
  static async getAll(userId) {
    return await Expense.findAll({
      where: {
        user_id: Number(userId),
      },
    });
  }

  /**
   * Obtém uma despesa específica com base no ID e no ID do usuário.
   *
   * @param {number} id - O ID da despesa.
   * @param {number} userId - O ID do usuário dono da despesa.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto da despesa encontrada.
   */
  static async getById(id, userId) {
    return await Expense.findOne({
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    });
  }

  /**
   * Cria uma nova despesa.
   *
   * @param {Object} expense - O objeto da despesa a ser criada.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto da despesa criada.
   */
  static async create(expense, userId) {
    return await Expense.create({ ...expense, user_id: userId }).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }

  /**
   * Atualiza uma despesa existente com base no ID e no ID do usuário.
   *
   * @param {Object} expense - O objeto da despesa a ser atualizada.
   * @param {number} id - O ID da despesa a ser atualizada.
   * @param {number} userId - O ID do usuário dono da despesa.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto da despesa atualizada.
   */
  static async updateById(expense, id, userId) {
    return await Expense.update(expense, {
      where: {
        id: Number(id),
        user_id: Number(userId),
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
   * Exclui uma despesa existente com base no ID e no ID do usuário.
   *
   * @param {number} id - O ID da despesa a ser excluída.
   * @param {number} userId - O ID do usuário dono da despesa.
   * @returns {Promise<number>} Uma Promise que resolve com o número de linhas excluídas (0 ou 1).
   */
  static async deleteById(id, userId) {
    return await Expense.destroy({
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    });
  }
}

module.exports = ExpenseService;
