const nodemailer = require('nodemailer');
const { ApiEmailSendError, ApiInvalidEmailAdressError } = require('../errors/email-errors');
const { ApiInvalidFileError } = require('../errors/file-errors');
const { ApiValidationError } = require('../errors/validation-errors');
const emailConsts = require('../constants/email-constants');
const errorConsts = require('../constants/error-constants');
const validator = require('validator');
const { fileExists } = require('../utils/file-utils');
const { error } = require('console');

let transporter = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: "icarokiilermelo@gmail.com",
      pass: "06062002"
   }
});

class EmailService {
   static async sendEmail(mail) {
      await transporter.sendMail(mail, (err, info) => {
         if (err) {
            throw new ApiEmailSendError(emailConsts.EMAIL_SEND_FAIL, err);
         }
      });
   }
}

class Email {
   constructor() {
      this.from        = '';
      this.subject     = '';
      this.text        = '';
      this.html        = '';
      this.attachments = [];
      this.to          = [];
   }

   setFrom(from) {
      this.from = from;
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

   addReceiverAdress(name, emailAdress) {
      if (emailAdress) {
         throw new ApiValidationError(errorConsts.ERROR_EMPTY_PARAM.replace('{placeholder}', 'emailAdress'));
      }

      if (!validator.isEmail(emailAdress)) {
         throw new ApiValidationError(emailConsts.replace('{placeholder}', emailAdress))
      }

      this.to.push({
         name: name,
         emailAdress: emailAdress
      });
   }
}

module.exports = EmailService;