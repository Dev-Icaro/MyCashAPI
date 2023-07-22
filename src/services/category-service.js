const Category = require("../models").Category;
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const { validateUserId } = require("../validators/auth-validator");

/**
 * Classe responsável por fornecer serviços relacionados a categorias.
 */
class CategoryService {
  /**
   * Obtém todas as categorias do usuário autenticado.
   *
   * @param {number} userId - O ID do usuário para filtrar as categorias.
   * @returns {Promise<Array>} Uma Promise que resolve em um array com todas as categorias do usuário.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async getAll(userId) {
    await validateUserId(userId);

    return await Category.findAll({
      where: {
        user_id: Number(userId),
      },
    });
  }

  /**
   * Obtém uma categoria específica com base no ID e no ID do usuário autenticado.
   *
   * @param {number} id - O ID da categoria.
   * @param {number} userId - O ID do usuário dono da categoria.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto da categoria encontrada.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async getById(id, userId) {
    await validateUserId(userId);

    return await Category.findOne({
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    });
  }

  /**
   * Cria uma nova categoria para o usuário autenticado.
   *
   * @param {Object} category - O objeto da categoria a ser criada.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto da categoria criada.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async create(category, userId) {
    await validateUserId(userId);

    return await Category.create({ ...category, user_id: userId }).catch(
      (err) => SequelizeErrorWrapper.wrapError(err),
    );
  }

  /**
   * Atualiza uma categoria existente com base no ID e no ID do usuário autenticado.
   *
   * @param {Object} category - O objeto da categoria a ser atualizada.
   * @param {number} id - O ID da categoria a ser atualizada.
   * @param {number} userId - O ID do usuário dono da categoria.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto da categoria atualizada.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async updateById(category, id, userId) {
    await validateUserId(userId);

    return await Category.update(category, {
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
   * Exclui uma categoria existente com base no ID e no ID do usuário autenticado.
   *
   * @param {number} id - O ID da categoria a ser excluída.
   * @param {number} userId - O ID do usuário dono da categoria.
   * @returns {Promise<number>} Uma Promise que resolve com o número de linhas excluídas (0 ou 1).
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async deleteById(id, userId) {
    await validateUserId(userId);

    return await Category.destroy({
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    });
  }
}

module.exports = CategoryService;
