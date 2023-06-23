const dataBase = require('../models');
const { ERROR_MISSING_PARAM } = require('../constants/error-constants');
const { MSG_EMAIL_NOT_FOUND, MSG_EMAIL_SUCCESS, MSG_MISSING_EMAIL_JSON } = require('../constants/config-contants');
const EmailConfigValidator = require('../validators/email-config-validator');

class ConfigService {
   static async getEmailConfigById(id) {
      if (!id) 
         return { statusCode: 400, message: ERROR_MISSING_PARAM + 'id' };

      let emailConfig = await dataBase['emailConfig']
         .findOne({ 
            where: { id: Number(id) }
         });

      if (!emailConfig) 
         return { statusCode: 400, message: MSG_EMAIL_NOT_FOUND }
      else 
         return { statusCode: 200, emailConfig };
   }

   static async createEmailConfig(emailConfig) {
      let emailConfigValidator = new EmailConfigValidator();
      emailConfigValidator.validate(emailConfig);

      if (!emailConfigValidator.isDataValid())
         return { statusCode: 400, message: emailConfigValidator.getErrors() }

      await dataBase['emailConfig'].create(emailConfig);
      return { statusCode: 200, message: MSG_EMAIL_SUCCESS};
   }
}

module.exports = ConfigService;

