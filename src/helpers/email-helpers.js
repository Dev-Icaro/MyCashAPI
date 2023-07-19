// Libs
const validator = require("validator");
const nodemailer = require("nodemailer");
const fs = require("fs");

// Constants
const errorConsts = require("../constants/error-constants");
const emailConsts = require("../constants/email-constants");

// Helpers / Utils
const ApiValidationResult = require("./api-validation-result");
const ErrorMessageFormatter = require("./error-message-formatter");

// Models
const { ApiEmailConfigurationError } = require("../errors/email-errors");

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
    errors.addError(ErrorMessageFormatter.formatNotEmptyErr("from"));
  }
  // Apenas valido o formato do email se ele passar pela condição anterior
  else if (!validator.isEmail(email.from)) {
    errors.addError(
      emailConsts.ERROR_INVALID_EMAIL.replace("{placeholder}", email.from),
    );
  }

  if (validator.isEmpty(email.subject)) {
    errors.addError(ErrorMessageFormatter.formatNotEmptyErr("subject"));
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
async function createTransporter() {
  const emailConfigPath = "./config/email-config.json";

  if (!fs.existsSync(emailConfigPath)) {
    throw new ApiEmailConfigurationError(
      emailConsts.ERROR_EMAIL_NOT_CONFIGURATED,
      'Missing "email-config.json" in config folder',
    );
  }

  const emailConfig = JSON.parse(fs.readFileSync(emailConfigPath, "utf-8"));

  return nodemailer.createTransport(emailConfig);
}

module.exports = {
  validateEmail,
  createTransporter,
};
