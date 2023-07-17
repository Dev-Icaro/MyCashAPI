// Libs
const validator = require("validator");
const nodemailer = require("nodemailer");

// Constants
const errorConsts = require("../constants/error-constants");
const emailConsts = require("../constants/email-constants");

// Helpers / Utils
const ApiValidationResult = require("./api-validation-result");
const { decrypt } = require("../utils/crypt-utils");

// Models
const models = require("../models");
const EmailConfigService = require("../services/email-config-service");
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
    errors.addError(
      errorConsts.ERROR_EMPTY_FIELD.replace("{placeholder}", '"from"')
    );
  }
  // Apenas valido o formato do email se ele passar pela condição anterior
  else if (!validator.isEmail(email.from)) {
    errors.addError(
      emailConsts.ERROR_INVALID_EMAIL.replace("{placeholder}", email.from)
    );
  }

  if (validator.isEmpty(email.subject)) {
    errors.addError(
      errorConsts.ERROR_EMPTY_FIELD.replace("{placeholder}", '"subject"')
    );
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
 * const transporter = createTransporter();
 * transporter.sendEmail(email);
 */
async function createTransporter(userId) {
  const emailConfigService = new EmailConfigService(userId);
  const emailConfig = await emailConfigService.getDefaultEmailConfig();

  if (!emailConfig) {
    throw new ApiEmailConfigurationError(
      emailConsts.EMAIL_SEND_FAIL,
      emailConsts.ERROR_EMAIL_NOT_CONFIGURATED
    );
  }

  let smtpConfig = await createSmtpConfig(emailConfig);

  return nodemailer.createTransport(smtpConfig);
}

/**
 * Cria um objeto SmtpConfig baseado em uma configuração de Email (EmailConfig)
 * idêntificando qual o host e criando o objeto correspondente.
 *
 * @param {EmailConfig} emailConfig - Instância do model EmailConfig que desejamos
 * criar a SmtpConfig.
 * @returns {SmtpConfig} - Objeto que representa uma configuração de email válida para
 * ser utilizado no nodemailer.
 */
async function createSmtpConfig(emailConfig) {
  const host = emailConfig.server;

  if (host.includes("gmail")) {
    return await createGmailSmtpConfig(emailConfig);
  } else {
    return await createDefaultSmtpConfig(emailConfig);
  }
}

/**
 * Cria um objeto SmtpConfig no padrão Gmail.
 *
 * @param {EmailConfig} emailConfig - Instância do model EmailConfig que desejamos
 * criar a SmtpConfig.
 * @returns {SmtpConfig} - Objeto que representa uma configuração de email válida para
 * ser utilizado no nodemailer
 */
async function createGmailSmtpConfig(emailConfig) {
  return {
    service: "gmail",
    auth: {
      user: emailConfig.username,
      pass: await decrypt(emailConfig.password, emailConfig.iv),
    },
  };
}

/**
 * Cria um objeto SmtpConfig padrão.
 *
 * @param {EmailConfig} emailConfig - Instância do model EmailConfig que desejamos
 * criar a SmtpConfig.
 * @returns {SmtpConfig} - Objeto que representa uma configuração de email válida para
 * ser utilizado no nodemailer.
 */
async function createDefaultSmtpConfig(emailConfig) {
  return {
    host: emailConfig.server,
    port: emailConfig.port,
    secure: emailConfig.useSSL || emailConfig.useTLS,
    auth: {
      user: emailConfig.username,
      pass: await decrypt(emailConfig.password, emailConfig.iv),
    },
  };
}

module.exports = {
  validateEmail,
  createTransporter,
};
