const models = require("../models");
const EmailConfig = models.EmailConfig;
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");

/**
 * Service de configuração de email, contém um CRUD para a manipulação dos dados.
 */
class EmailConfigService {
   /**
    * Getter pelo ID.
    *
    * @param {integer} id - Id do Email no banco de dados.
    * @returns {EmailConfig} - JSON contendo as configurações de email.
    */
   static async getEmailConfigById(id) {
      return await EmailConfig.getEmailConfigById(id);
   }

   /**
    * Getter all.
    *
    * @returns {EmailConfig} - JSON Array contendo todas as configurações de email.
    */
   static async getAllEmailConfigs() {
      return await EmailConfig.findAll();
   }

   /**
    * Atualiza uma configuração de email pelo id.
    *
    * @param {EmailConfig} updatedConfig - Novos dados.
    * @param {integer} id - Id do registro na tabela que desejamos alterar
    * @returns
    */
   static async updateEmailConfigById(updatedConfig, id) {
      return await EmailConfig.update(updatedConfig, {
         where: {
            id: Number(id),
         },
      })
         .then(async () => {
            return await EmailConfig.getEmailConfigById(id);
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
   static async createEmailConfig(emailConfig) {
      return await EmailConfig.create(emailConfig)
         .then((createdEmailConfig) => {
            delete createdEmailConfig.dataValues.password;
            return createdEmailConfig;
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
   static async deleteEmailConfigById(id) {
      await EmailConfig.destroy({ where: { id: Number(id) } });
   }
}

module.exports = EmailConfigService;
