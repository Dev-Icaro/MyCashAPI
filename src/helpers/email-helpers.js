// Libs
const validator = require('validator');

// Constants
const errorConsts = require('../constants/error-constants');
const emailConsts = require('../constants/email-constants');

// Helpers / Utils
const ApiValidationResult = require('./api-validation-result');

// Models
const models = require('../models');
const EmailConfig = models.EmailConfig;

/**
 * Valida uma instânica de Email
 * 
 * @param {Email} email - Instância da classe email que desejamos validar.
 * @returns {ApiValidationResult} - Instância de ApiValidationResult, um helper que visa
 * manipular os resultados da validação, consulte sua documentação para maior entendimento.
 * 
 * @example
 * const isValidEmail = validateEmail(email);
 */
function validateEmail(email) {  
   const errors = new ApiValidationResult();

   if (validator.isEmpty(email.from)) {
      errors.addError(errorConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', '"from"'));
   }
   // Apenas valido o formato do email se ele passar pela condição anterior
   else if (!validator.isEmail(email.from)) {
      errors.addError(emailConsts.ERROR_INVALID_EMAIL.replace('{placeholder}', email.from));
   }

   if (validator.isEmpty(email.subject)) {
      errors.addError(errorConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', '"subject"'));
   }

   if (validator.isEmpty(email.text) && validator.isEmail(email.html)) {
      errors.addError(emailConsts.ERROR_EMPTY_EMAIL_BODY);
   }

   if (!email.hasReceiverAddress()) {
      errors.addError(emailConsts.ERROR_EMPTY_RECEIVER);
   }

   return errors;
}

/**
 * Retorna uma instânica do Transporter da lib nodemailer configurado
 * com o email padrão definido no model EmailConfig
 * 
 * @param {void}
 * @returns {Transport} - Instância de transporter.
 * 
 * @example 
 * const transporter = getTransporter();
 * transporter.sendEmail(email);
 */
async function getTransporter() {
   const emailConfig = await EmailConfig.getDefaultEmailConfig();
   if (!emailConfig) {
      throw new ApiEmailConfigurationError(emailConsts.EMAIL_SEND_FAIL, emailConsts.ERROR_EMAIL_NOT_CONFIGURATED);
   }

   let smtpConfig = {
      service: 'gmail',
//      host: emailConfig.server,
//      port: emailConfig.port,
//      secure: (emailConfig.useSSL || emailConfig.useTLS),
      auth: {
         user: emailConfig.username,
         pass: await decrypt(emailConfig.password, emailConfig.iv)
      }
   }

   return nodemailer.createTransport(smtpConfig); 
}

/**
 * Classe responsável por criar um objeto que representa as configurações
 * de smtp válidas para ser utilizada no nodemailer.
 */
class SmtpConfig {
   /**
    * Método que retorna um Objeto SmtpConfig adequado com base nas configurações
    * de email.
    * 
    * @param {EmailConfig} emailConfig - Recebe uma instãncia do model EmailConfig.
    * @returns {SmtpConfig} - Objeto contendo as configurações de smtp.
    */
   static async createSmtpConfig(emailConfig) {
      const host = emailConfig.host;

      if (host.includes('gmail')) {
         return await this.createGmailSmtpConfig();
      } 
      else {
         return await this.createDefaultSmtpConfig();
      }
   }

   static async createGmailSmtpConfig(emailConfig) {
      return {
         service: 'gmail',
         auth: {
            user: emailConfig.username,
            pass: await decrypt(emailConfig.password, emailConfig.iv)
         }
      }
   }

   static async createDefaultSmtpConfig(emailConfig) {
      return {
         host: emailConfig.server,
         port: emailConfig.port,
         secure: (emailConfig.useSSL || emailConfig.useTLS),
         auth: {
            user: emailConfig.username,
            pass: await decrypt(emailConfig.password, emailConfig.iv)
         }
      }
   }
}

module.exports = {
   validateEmail,
   getTransporter
}