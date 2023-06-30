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

      email.setFrom('icarokiilermelo@gmail.com');
      email.setSubject('MyCash - Recuperation email');
      email.addReceiverAddress(user.email);
      email.setHtml(
         `<p> Here is your recuperation code: <br> 
         <strong> ${user.resetToken} <strong>`
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

   addAtthachment(filename, path) {
      if (!fileExists(path)) {
         throw new ApiInvalidFileError(errorConsts.ERROR_FILE_NOT_FOUND.replace('{placeholder}', path));
      }

      this.attachments.push({
         filename: filename,
         path: path
      });
   }

   addReceiverAddress(emailAdress) {
      if (!emailAdress) {
         throw new ApiValidationError(errorConsts.ERROR_EMPTY_PARAM.replace('{placeholder}', 'emailAdress'));
      }

      if (!validator.isEmail(emailAdress)) {
         throw new ApiValidationError(emailConsts.ERROR_INVALID_EMAIL.replace('{placeholder}', emailAdress));
      }

      this.to = this.to.trim().length() > 0 ? ',' + emailAdress : emailAdress;
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
   if (!email.from) {
      errors.addError(errorConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', '"from"'));
   }
   if (!validator.isEmail(email.from)) {
      errors.addError(emailConsts.ERROR_INVALID_EMAIL.replace('{placeholder}', email.from));
   }

   // Subject
   if (!email.subject) {
      errors.addError(errorConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', '"subject"'));
   }

   // Valida se o email está vazio
   if (!email.text && !email.html) {
      errors.addError(emailConsts.ERROR_EMPTY_EMAIL_BODY);
   }

   // To 
   if (email.to.length() <= 0) {
      errors.addError(emailConsts.ERROR_EMPTY_RECEIVER);
   }

   return errors;
}

module.exports = EmailService;