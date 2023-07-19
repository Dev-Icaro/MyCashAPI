// Libs
const validator = require("validator");

// Constants
const emailConsts = require("../constants/email-constants");
const errorConsts = require("../constants/error-constants");

// Errors
const { ApiInvalidFileError } = require("../errors/file-errors");
const { ApiValidationError } = require("../errors/validation-errors");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const { ApiEmailSendError } = require("../errors/email-errors");

// Helpers / Utils
const { fileExists } = require("../utils/file-utils");
const { validateEmail } = require("../helpers/email-helpers");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");

/**
 * Serviço de envio de emails.
 */
class EmailService {
  constructor(transporter) {
    if (!transporter) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.formatMissingArgumentErr("transporter"),
      );
    }

    this.transporter = transporter;
  }

  /**
   * Método para enviar emails.
   *
   * @param {Email} email - Instância de Email que desejamos enviar.
   * @returns {Promise<import('nodemailer').SentMessageInfo>} - Uma promessa que resolve
   * em um objeto contendo informações do envio.
   * @throws {ApiValidationError} - Erro relacionados a validação dos dados.
   * @throws {ApiEmailSendError} - Erro relacionado ao envio do email.
   */
  async sendEmail(email) {
    const errors = validateEmail(email);
    if (!errors.isEmpty()) {
      throw new ApiValidationError(
        errorConsts.MSG_VALIDATION_ERROR,
        errors.getErrors(),
      );
    }

    // Antes de enviar o email verifico se as configurações de email são válidas.
    await this.transporter
      .verify()
      .then(async (info) => {
        await this.transporter.sendMail(email);
      })
      .then((emailInfo) => {
        return emailInfo;
      })
      .catch((err) => {
        throw new ApiEmailSendError(
          emailConsts.ERROR_INVALID_EMAIL_CONFIG,
          err,
        );
      });
  }

  /**
   * Envia um email contento o resetToken para o usuário paramêtro.
   *
   * @param {User} - Usuário que desejamos enviar o ResetToken
   * @returns {Promise<Object>} - Um objeto contento informações sobre o envio do email.
   */
  async sendResetTokenEmail(user) {
    const email = new Email();

    email
      .setFrom("projectmycash0@gmail.com")
      .setSubject("MyCash - Recuperation email")
      .addReceiverAddress(user.email)
      .setHtml(
        `<p> Here is your reset token, use it to reset your password: <br> 
            ${user.resetToken}</p>`,
      );

    return await this.sendEmail(email);
  }
}

/**
 * Classe representando um Email, que poderá ser enviado
 * pelo EmailService no método SendMail.
 */
class Email {
  /**
   * Cria uma instância de email;
   *
   * @param {void}
   * @return {void}
   */
  constructor() {
    this.from = "";
    this.subject = "";
    this.text = "";
    this.html = "";
    this.to = "";
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
      throw new ApiValidationError(
        ErrorMessageFormatter.formatMissingArgumentErr("path"),
      );
    }

    if (!fileExists(path)) {
      throw new ApiInvalidFileError(
        errorConsts.ERROR_FILE_NOT_FOUND.replace("{placeholder}", path),
      );
    }

    const attachment = {
      path: path,
    };

    // Uso a atribuição condicional para criar a propriedade apenas se filename tiver um valor
    filename !== undefined && (attachment["filename"] = filename);

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
      throw new ApiValidationError(
        ErrorMessageFormatter.formatMissingArgumentErr("emailAdress"),
      );
    }

    if (!validator.isEmail(emailAddress)) {
      throw new ApiValidationError(
        emailConsts.ERROR_INVALID_EMAIL.replace("{placeholder}", emailAddress),
      );
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
    return this.to.length > 0;
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
      throw new ApiValidationError(
        errorConsts.MSG_VALIDATION_ERROR,
        errors.getErrors(),
      );
    }
  }
}

module.exports = EmailService;
