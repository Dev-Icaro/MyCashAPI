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

/**
 * Classe representando um Email, que poderá ser enviado
 * pelo EmailService no método SendEmail.
 */
class Email {
   /**
    * Cria uma instância de email;
    * 
    * @param {void}
    * @return {void}
    */
   constructor() {
      this.from        = '';
      this.subject     = '';
      this.text        = '';
      this.html        = '';
      this.to          = '';
      this.attachments = [];
   }

   /**
    * Define o from do email.
    * 
    * @param {string} from - Email de quem está enviando.
    * @returns {Object} - Retorno this para permitir o chaining.
    */
   setFrom(from) {
      this.from = from.trim();
      return this;
   }

   /**
    * Define o subject(assunto) do email.
    * 
    * @param {string} subject - Assunto do email. 
    * @returns {this} - Retorno this para permitir o chaining.
    */
   setSubject(subject) {
      this.subject = subject;
      return this;
   }
   
   /**
    * Define o conteúdo HTML do email.
    * 
    * @param {string} html - Conteúdo HTML que dejamos
    * inserir no corpo do email. 
    * @returns {this} - Retorno this para permitir o chaining.
    * 
    * @example 
    * const email = new Email();
    * email.setHtml(
    *    <div> 
    *       <p>
    *          Hello World!
    *       </p>
    *    </div>
    * );
    * 
    */
   setHtml(html) {
      this.html = html;
      return this;
   }

   /**
    * Define o conteúdo texto do email.
    * 
    * @param {string} text - Conteúdo texto doque desejamos
    * inserir no corpo do email.
    * @returns {this} - Retorno this para permitir o chaining.
    */
   setText(text) {
      this.text = text;
      return this;
   }

   /**
    * Adiciona um anexo ao email, podendo anexar inúmeros
    * anexos invocando o método novamente.
    * 
    * @param {string} path - Local do arquivo computador.
    * @param {string} [filename] - Nome do arquivo (opcional).
    * @returns {this} - Retorno this para permitir o chaining.
    * @throws {ApiValidationError} - Exceção contendo o erro de validação.
    * 
    * @example 
    * const email = new Email();
    * email.addAtthachment('C:\RelatorioBancario.xls', 'Relatório bancário');
    */
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

   /**
    * Adiciona um email de destino, você pode adicionar mais de um email,
    * basta invocar o método multiplas vezes ou criar uma string com os emails separados
    * por vírgulas.
    * 
    * @param {string} emailAddress - Email de destíno
    * @returns {this} - Retorno this para permitir o chaining.
    * @throws {ApiValidationError} - Exceção contendo o erro de validação.
    * 
    * @example
    * const email = new Email();
    * Email.addReceiverAdress('projetomycash@gmail.com');
    */
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

   /**
    * Verifica se exite um email de destino setado.
    * 
    * @param {void}
    * @returns {boolean} - Booleana indicando se existe um email de destino setado
    */
   hasReceiverAddress() {
      return (this.to.length > 0);
   }

   /**
    * Método que valida as informações contidas em sua instância.
    * 
    * @param {void} 
    * @returns {void}
    * @throws {ApiValidationError} - Exceção contendo os erros de validação
    * @example 
    * const email = new Email();
    * email.validate(); // Saída: ApiValidationError devido a não ter dados válidos.
    */
   validate() {
      const errors = validateEmail(this);
      if (!errors.isEmpty()) {
         throw new ApiValidationError(errorConsts.MSG_VALIDATION_ERROR, errors.getErrors());
      }
   }
}

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