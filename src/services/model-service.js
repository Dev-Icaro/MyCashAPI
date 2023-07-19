const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");

/**
 * Classe base para os Serviços de models.
 */
class ModelService {
  /**
   * Cria uma instância de ModelService.
   *
   * @param {integer} userId - Id do usuário que iremos efetuar as operações
   * @param {Model} model - Model iremos efetuar as operações.
   */
  constructor(userId, model) {
    if (!userId) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.formatMissingArgumentErr("userId"),
      );
    }

    if (!model) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.formatMissingArgumentErr("model"),
      );
    }

    this.model = model;
    this.userId = userId;
  }

  /**
   * Pega todos os registros do modelo.
   *
   * @returns {Model} - JSON contendo os registros encontrados.
   */
  async getAll() {
    return await this.model.findAll({
      where: {
        user_id: Number(this.userId),
      },
    });
  }

  /**
   * Pega o registro pelo Id.
   *
   * @param {integer} id - Id do registro.
   * @returns {Model} - JSON do registro.
   */
  async getById(id) {
    return await this.model.findOne({
      where: {
        user_id: Number(this.userId),
        id: Number(id),
      },
    });
  }

  /**
   * Cria um registro no modelo.
   *
   * @param {Model} dataValues - JSON contendo as informações necessárias
   * para a criação do registro do modelo.
   * @returns {Model} - JSON contendo as informações do registro criado.
   */
  async create(dataValues) {
    dataValues.user_id = this.userId;

    return await this.model
      .create(dataValues)
      .then((createdRegister) => {
        return createdRegister;
      })
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Atualiza um registro pelo ID.
   *
   * @param {Model} updatedValues - Dados atualizados que desejamos definir.
   * @param {integer} id - ID do registro que deejamos atualizar.
   * @returns {Model} - Dados do registro atualizados.
   */
  async updateById(updatedValues, id) {
    return await this.model
      .update(updatedValues, {
        where: {
          id: Number(id),
          user_id: Number(this.userId),
        },
      })
      .then(async () => {
        return await this.getById(id);
      })
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Deleta um registro pelo ID.
   *
   * @param {integer} id - Id do registro que desejamos deletar.
   */
  async deleteById(id) {
    await this.model.destroy({
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    });
  }
}

module.exports = ModelService;
