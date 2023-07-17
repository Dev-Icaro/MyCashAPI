const models = require("../models");
const EmailConfig = models.EmailConfig;
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");

/**
 * Service de configuração de email, contém um CRUD para a manipulação dos dados.
 */
class EmailConfigService {
  /**
   * Instância EmailConfigService armazenando o id do
   * usuário para efetuar as querys.
   *
   * @param {integer} userId
   */
  constructor(userId) {
    this.userId = userId;
  }

  /**
   * Getter pelo ID.
   *
   * @param {integer} id - Id do Email no banco de dados.
   * @returns {EmailConfig} - JSON contendo as configurações de email.
   */
  async getEmailConfigById(id) {
    return await EmailConfig.findOne({
      where: {
        user_id: Number(this.userId),
        id: Number(id),
      },
    }).then((emailConfig) => deleteSensitiveProps(emailConfig));
  }

  /**
   * Getter all.
   *
   * @returns {EmailConfig} - JSON Array contendo todas as configurações de email.
   */
  async getAllEmailConfigs() {
    return await EmailConfig.findAll({
      where: {
        user_id: Number(this.userId),
      },
    }).then((results) => {
      return results.map((emailConfig) => deleteSensitiveProps(emailConfig));
    });
  }

  /**
   * Atualiza uma configuração de email pelo id.
   *
   * @param {EmailConfig} updatedConfig - Novos dados.
   * @param {integer} id - Id do registro na tabela que desejamos alterar
   * @returns
   */
  async updateEmailConfigById(updatedConfig, id) {
    return await EmailConfig.update(updatedConfig, {
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    })
      .then(async () => {
        return await EmailConfig.getEmailConfigById(id).then((emailConfig) =>
          deleteSensitiveProps(emailConfig)
        );
      })
      .catch((e) => {
        SequelizeErrorWrapper.wrapError(e);
      });
  }

  /**
   * Cria uma nova configuração de email.
   *
   * @param {EmailConfig} emailConfig - Dados da nova configuração de email
   * @returns {EmailConfig} - Dados da configuração de email criada.
   */
  async createEmailConfig(emailConfig) {
    emailConfig.user_id = this.userId;

    return await EmailConfig.create(emailConfig)
      .then((createdEmailConfig) => {
        return deleteSensitiveProps(createdEmailConfig);
      })
      .catch((e) => {
        SequelizeErrorWrapper.wrapError(e);
      });
  }

  /**
   * Deleta uma configuração de email pelo id.
   *
   * @param {integer} id - Id do registro que desejamos deletar.
   * @returns {void}
   */
  async deleteEmailConfigById(id) {
    await EmailConfig.destroy({
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    });
  }

  async getDefaultEmailConfig() {
    return await EmailConfig.findOne({
      where: {
        user_id: Number(this.userId),
      },
      order: [
        ["defaultEmail", "DESC"],
        ["id", "ASC"],
      ],
    });
  }
}

function deleteSensitiveProps(emailConfig) {
  delete emailConfig.dataValues.password;
  delete emailConfig.dataValues.iv;
  return emailConfig;
}

module.exports = EmailConfigService;
