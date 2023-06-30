// Libs
const nodemailer = require('nodemailer');
const validator = require('validator');

// Constants
const emailConsts = require('../constants/email-constants');
const errorConsts = require('../constants/error-constants');

// Errors
const { ApiEmailSendError } = require('../errors/email-errors');
const { ApiInvalidFileError } = require('../errors/file-errors');
const { ApiValidationError } = require('../errors/validation-errors');

// Helpers / Utils
const { fileExists } = require('../utils/file-utils');
const ErrorHelper = require('../helpers/error-helper');

let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: "icarokiilermelo@gmail.com",
      pass: "wporcyufwjquwlui"
   }
});

class EmailService {

   static async sendEmail(email) {
      const errors = validateEmail(email);
      if (!errors.isEmpty()) {
         throw new ApiValidationError(errorConsts.MSG_VALIDATION_ERROR, errors.getErrors());
      }

      await transporter.sendMail(email, (err, info) => {
         if (err) {
            throw new ApiEmailSendError(emailConsts.EMAIL_SEND_FAIL, err);
         } 
         else {
            return info;
         }
      });
   }

   static async sendResetTokenEmail(user) {
      const email = new Email();

      email
         .setFrom('icarokiilermelo@gmail.com')
         .setSubject('MyCash - Recuperation email')
         .addReceiverAddress(user.email)
         .setHtml(
            `<p> Here is your recuperation code: <br> 
            <strong> ${user.resetToken} <strong>`
         )

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
   }

   setSubject(subject) {
      this.subject = subject;
   }

   setHtml(html) {
      this.html = html;
   }

   setText(text) {
      this.text = text;
   }

   addAtthachment(path, filename) {
      if (validator.isEmpty(path)) {
         throw new ApiValidationError(errorConsts.ERROR_EMPTY_PARAM.replace('{placeholder}', '"filename"')); 
      }

      if (!fileExists(path)) {
         throw new ApiInvalidFileError(errorConsts.ERROR_FILE_NOT_FOUND.replace('{placeholder}', path));
      }

      
      this.attachments.push({
         filename: filename,
         path: path
      });
   }

   addReceiverAddress(emailAddress) {
      if (!emailAddress) {
         throw new ApiValidationError(errorConsts.ERROR_EMPTY_PARAM.replace('{placeholder}', 'emailAddress'));
      }

      if (!validator.isEmail(emailAddress)) {
         throw new ApiValidationError(emailConsts.ERROR_INVALID_EMAIL.replace('{placeholder}', emailAddress));
      }

      this.to += this.hasReceiverAddress() ? `, ${emailAddress}` : emailAddress;
   }

   hasReceiverAddress() {
      return (this.to.length() > 0);
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
   const errors = new ErrorHelper();

   // From
   if (validator.isEmpty(email.from)) {
      errors.addError(errorConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', '"from"'));
   } 
   // Só valido o formato do email caso a condição anterior tenha passado
   else if (!validator.isEmail(email.from)) {
      errors.addError(emailConsts.ERROR_INVALID_EMAIL.replace('{placeholder}', email.from));
   }
      
   // Subject
   if (validator.isEmpty(email.subject)) {
      errors.addError(errorConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', '"subject"'));
   }

   // Valida se o conteudo do email está vazio
   if (validator.isEmpty(email.text) && validator.isEmpty(email.html)) {
      errors.addError(emailConsts.ERROR_EMPTY_EMAIL_BODY);
   }

   // To 
   if (!email.hasReceiverAddress()) {
      errors.addError(emailConsts.ERROR_EMPTY_RECEIVER);
   }

   return errors;
}

module.exports = EmailService;