// Libs
const nodemailer = require('nodemailer');
const validator = require('validator');

// Constants
const emailConsts = require('../constants/email-constants');
const errorConsts = require('../constants/error-constants');

// Errors
const { ApiEmailSendError, ApiEmailConfigurationError } = require('../errors/email-errors');
const { ApiInvalidFileError } = require('../errors/file-errors');
const { ApiValidationError } = require('../errors/validation-errors');

// Helpers / Utils
const { fileExists } = require('../utils/file-utils');
const { decrypt } = require('../utils/crypt-utils');
const ApiValidationResult = require('../helpers/api-validation-result');

// Models
const models = require('../models');
const EmailConfig = models.EmailConfig;


class EmailService {
   static async sendEmail(email) {
      const errors = validateEmail(email);
      if (!errors.isEmpty()) {
         throw new ApiValidationError(errorConsts.MSG_VALIDATION_ERROR, errors.getErrors());
      }

      let transporter = await getTransporter();
      
      try {
         await transporter.verify();
         await transporter.sendEmail(email);
      } 
      catch(e) {
         throw new ApiEmailConfigurationError(emailConsts.ERROR_INVALID_EMAIL_CONFIG, err);
      }

      /*transporter.sendMail(email, (err, info) => {
         if (err) {
            throw new ApiEmailSendError(emailConsts.EMAIL_SEND_FAIL, err);
         }
         else {
            return info;
         }
      });*/
   }

   static async sendResetTokenEmail(user) {
      const email = new Email();

      email
         .setFrom('icarokiilermelo@gmail.com')
         .setSubject('MyCash - Recuperation email')
         .addReceiverAddress(user.email)
         .setHtml(
            `<p> Here is your recuperation code: <br> 
            <strong> ${user.resetToken} <strong></p>`
         );

      const emailInfo = await this.sendEmail(email);
      return emailInfo;
   }
}

class Email {
   constructor() {
      this.from        = '';
      this.subject     = '';
      this.text        = '';
      this.html        = '';
      this.to          = '';
      this.attachments = [];
   }

   setFrom(from) {
      this.from = from.trim();
      return this;
   }

   setSubject(subject) {
      this.subject = subject;
      return this;
   }

   setHtml(html) {
      this.html = html;
      return this;
   }

   setText(text) {
      this.text = text;
      return this;
   }

   addAtthachment(path, filename) {
      if (validator.isEmpty(path)) {
         throw new ApiValidationError(errorConsts.ERROR_EMPTY_PARAM.replace('{placeholder}', '"path"'))
      }

      if (!fileExists(path)) {
         throw new ApiInvalidFileError(errorConsts.ERROR_FILE_NOT_FOUND.replace('{placeholder}', path));
      }

      const attachment = {
         path: path
      }

      // Uso a atribuição condicional para criar a propriedade apenas se filename tiver um valor
      filename !== undefined && (attachment['filename'] = filename);

      this.attachments.push(attachment);

      return this;
   }

   addReceiverAddress(emailAddress) {
      if (validator.isEmpty(emailAddress)) {
         throw new ApiValidationError(errorConsts.ERROR_EMPTY_PARAM.replace('{placeholder}', 'emailAddress'));
      }

      if (!validator.isEmail(emailAddress)) {
         throw new ApiValidationError(emailConsts.ERROR_INVALID_EMAIL.replace('{placeholder}', emailAddress));
      }

      // Verifico se já existe algum endereço, se sim adiciono com "," para manter a formatação
      this.to += this.hasReceiverAddress() ? `, ${emailAddress}` : emailAddress;

      return this;
   }

   hasReceiverAddress() {
      return (this.to.length > 0);
   }

   validate() {
      // Método para a classe se auto validar por conveniência
      const errors = validateEmail(this);
      if (!errors.isEmpty()) {
         throw new ApiValidationError(errorConsts.MSG_VALIDATION_ERROR, errors.getErrors());
      }
   }
}

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

async function getTransporter() {
   const emailConfig = await EmailConfig.getDefaultEmailConfig();
   if (!emailConfig) {
      throw new ApiEmailConfigurationError(emailConsts.EMAIL_SEND_FAIL, emailConsts.ERROR_EMAIL_NOT_CONFIGURATED);
   }

   let smtpConfig = {
      host: emailConfig.server,
      port: emailConfig.port,
      secure: (emailConfig.useSSL || emailConfig.useTLS),
      auth: {
         user: emailConfig.username,
         pass: await decrypt(emailConfig.password)
      }
   }

   return nodemailer.createTransport(smtpConfig); 
}

module.exports = EmailService;