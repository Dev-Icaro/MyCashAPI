/**
 * Classe helper para ajudar na manipulação de resultados de validações, contém
 * mecanismo parecido com o validationResult do expressValidator.
 */
class ApiValidationResult {
  /**
   * Cria uma instãncia de ApiValidationResult
   *
   * @param {void}
   * @returns {void}
   */
  constructor() {
    this.errors = [];
  }

  /**
   * Adiciona um erro.
   *
   * @param {string} error - Mensagem de erro.
   * @returns {void}
   */
  addError(error) {
    if (!error) {
      return;
    }

    this.errors.push(error);
  }

  /**
   * Retorna os erros adicionados.
   *
   * @param {void}
   * @returns {Array} - Array contendo os erros adicionados
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Verifica se foi adicionado algum erro.
   *
   * @returns {boolean} - Booleana indicando se está vazio ou não
   */
  isEmpty() {
    return this.errors.length === 0;
  }
}

module.exports = ApiValidationResult;
