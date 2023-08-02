// Libs
const validator = require("validator");
const nodemailer = require("nodemailer");
const fs = require("fs");

// Constants
const emailConsts = require("../constants/email-constants");

// Helpers / Utils
const ApiValidationResult = require("./api-validation-result");
const ErrorMessageFormatter = require("../utils/error-message-formatter");

// Models
const { ApiEmailConfigurationError } = require("../errors/email-errors");

const emailConfigPath = "./config/email-config.json";

/**
 * Validate the instance of Email class.
 *
 * @param {Email} email - The Email that we want to validate.
 * @returns {ApiValidationResult} - Instance of a error helper class.
 *
 * @example
 * const isValidEmail = validateEmail(email);
 */
function validateEmail(email) {
  const errors = new ApiValidationResult();

  if (validator.isEmpty(email.from)) {
    errors.addError(ErrorMessageFormatter.notEmpty("from"));
  } else if (!validator.isEmail(email.from)) {
    errors.addError(
      emailConsts.ERROR_INVALID_EMAIL.replace("{placeholder}", email.from),
    );
  }

  if (validator.isEmpty(email.subject)) {
    errors.addError(ErrorMessageFormatter.notEmpty("subject"));
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
 * Return an Instance nodemailer transporter configurated with
 * the email config in config file.
 *
 * @param {void}
 * @returns {Transport} - The transporter instance.
 *
 * @example
 * const transporter = createTransporter();
 * transporter.sendEmail(email);
 */
async function createTransporter() {
  if (!fs.existsSync(emailConfigPath)) {
    throw new ApiEmailConfigurationError(
      emailConsts.ERROR_EMAIL_NOT_CONFIGURATED,
      'Missing "email-config.json" in config folder',
    );
  }

  const emailConfig = JSON.parse(fs.readFileSync(emailConfigPath, "utf-8"));

  return nodemailer.createTransport(emailConfig);
}

/**
 * Gets the email adress on config file.
 *
 * @returns {string} - The email adress.
 */
async function getEmailAddressInConfigFile() {
  if (!fs.existsSync(emailConfigPath)) {
    throw new ApiEmailConfigurationError(
      emailConsts.ERROR_EMAIL_NOT_CONFIGURATED,
      'Missing "email-config.json" in config folder',
    );
  }

  const emailConfig = JSON.parse(fs.readFileSync(emailConfigPath, "utf-8"));

  return emailConfig.auth.user;
}

module.exports = {
  validateEmail,
  createTransporter,
  getEmailAddressInConfigFile,
};
