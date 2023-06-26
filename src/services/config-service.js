const dataBase = require('../models');
const { ERROR_MISSING_PARAM } = require('../constants/error-constants');
const { MSG_EMAIL_NOT_FOUND, MSG_EMAIL_SUCCESS, MSG_MISSING_EMAIL_JSON } = require('../constants/config-contants');
const EmailConfigValidator = require('../validators/email-config-validator');

class ConfigService {
   static async getEmailConfigById(id) {
      if (!id) 
         return { statusCode: 400, message: ERROR_MISSING_PARAM + 'id' };

      let EmailConfig = await dataBase['EmailConfig']
         .findOne({ 
            where: { id: Number(id) }
         });

      if (!EmailConfig) 
         return { statusCode: 400, message: MSG_EMAIL_NOT_FOUND }
      else 
         return { statusCode: 200, EmailConfig };
   }

   static async createEmailConfig(EmailConfig) {
      let EmailConfigValidator = new EmailConfigValidator();
      EmailConfigValidator.validate(EmailConfig);

      if (!EmailConfigValidator.isDataValid())
         return { statusCode: 400, message: EmailConfigValidator.getErrors() }

      await dataBase['EmailConfig'].create(EmailConfig);
      return { statusCode: 200, message: MSG_EMAIL_SUCCESS};
   }
}

module.exports = ConfigService;

