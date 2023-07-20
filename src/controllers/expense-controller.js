const ExpenseService = require("../services/expense-service");

/**
 * Controller responsável por manipular as requisições relacionadas a despesas.
 */
class ExpenseController {
  /**
   * Obtém todas as despesas do usuário autenticado.
   *
   * @param {Object} req - O objeto de requisição do Express.
   * @param {Object} res - O objeto de resposta do Express.
   * @param {Function} next - O próximo middleware na cadeia.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto JSON contendo todas as despesas do usuário.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async getAll(req, res, next) {
    try {
      const expenses = await ExpenseService.getAll(req.userId);

      return res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Obtém uma despesa específica com base no ID e no ID do usuário autenticado.
   *
   * @param {Object} req - O objeto de requisição do Express.
   * @param {Object} res - O objeto de resposta do Express.
   * @param {Function} next - O próximo middleware na cadeia.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto JSON contendo a despesa encontrada.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const expense = await ExpenseService.getById(id, req.userId);

      return res.status(200).json(expense);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Cria uma nova despesa para o usuário autenticado.
   *
   * @param {Object} req - O objeto de requisição do Express contendo os dados da despesa a ser criada.
   * @param {Object} res - O objeto de resposta do Express.
   * @param {Function} next - O próximo middleware na cadeia.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto JSON contendo a despesa criada.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async create(req, res, next) {
    try {
      const createdExpense = await ExpenseService.create(req.body, req.userId);

      return res.status(200).json(createdExpense);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Atualiza uma despesa existente com base no ID e no ID do usuário autenticado.
   *
   * @param {Object} req - O objeto de requisição do Express contendo os dados da despesa a ser atualizada.
   * @param {Object} res - O objeto de resposta do Express.
   * @param {Function} next - O próximo middleware na cadeia.
   * @returns {Promise<Object>} Uma Promise que resolve no objeto JSON contendo a despesa atualizada.
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const updatedExpense = await ExpenseService.updateById(
        req.body,
        id,
        req.userId,
      );

      return res.status(200).json(updatedExpense);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Exclui uma despesa existente com base no ID e no ID do usuário autenticado.
   *
   * @param {Object} req - O objeto de requisição do Express.
   * @param {Object} res - O objeto de resposta do Express.
   * @param {Function} next - O próximo middleware na cadeia.
   * @returns {Promise<number>} Uma Promise que resolve com o número de linhas excluídas (0 ou 1).
   * @throws {Error} Se ocorrer algum erro durante a execução do método.
   */
  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const deletedRows = await ExpenseService.deleteById(id, req.userId);

      return res.status(200).json(deletedRows);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExpenseController;
