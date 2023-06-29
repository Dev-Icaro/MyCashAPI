const models = require('../models');
const EmailConfig = models.EmailConfig;
const { SequelizeErrorWrapper } = require('../helpers/sequelize-error-wrapper');

class EmailConfigService {
   static async getEmailConfigById(id) {
      return await EmailConfig.getEmailConfigById(id);
   }

   static async getAllEmailConfigs() {
      return await EmailConfig.findAll();
   }

   static async updateEmailConfigById(updatedConfig, id) {
      return await EmailConfig.update(updatedConfig, {
         where: { 
            id: Number(id) 
         }
      })
         .then(async () => {
            return await EmailConfig.getEmailConfigById(id);
         })
         .catch((e) => {
            SequelizeErrorWrapper.wrapError(e);
         });
   }

   static async createEmailConfig(emailConfig) {
      return await EmailConfig.create(emailConfig)
         .then((createdEmailConfig) => {
            return createdEmailConfig;
         })
         .catch((e) => {
            SequelizeErrorWrapper.wrapError(e);
         });
   }

   static async deleteEmailConfigById(id) {
      return await EmailConfig.destroy({ where: { id: Number(id) }});
   }
}

module.exports = EmailConfigService;