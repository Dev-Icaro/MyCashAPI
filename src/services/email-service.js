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
const fs = require("fs");
const {
  validateEmail,
  getEmailAddressInConfigFile,
} = require("../helpers/email-helpers");
const ErrorMessageFormatter = require("../utils/error-message-formatter");

/**
 * Email service for sending emails.
 */
class EmailService {
  constructor(transporter) {
    if (!transporter) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("transporter"),
      );
    }

    this.transporter = transporter;
  }

  /**
   * Method for sending emails.
   *
   * @param {Email} email - Email instance to be sent.
   * @returns {Promise<import('nodemailer').SentMessageInfo>} - A promise that resolves
   * to an object containing sending information.
   * @throws {ApiValidationError} - Errors related to data validation.
   * @throws {ApiEmailSendError} - Error related to email sending.
   */
  async sendEmail(email) {
    const errors = validateEmail(email);
    if (!errors.isEmpty()) {
      throw new ApiValidationError(
        errorConsts.MSG_VALIDATION_ERROR,
        errors.getErrors(),
      );
    }

    await this.transporter
      .verify()
      .then(async () => {
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
   * Send an email containing the resetToken to the provided user.
   *
   * @param {User} user - User for whom the resetToken email is to be sent.
   * @returns {Promise<Object>} - An object containing information about the email sending.
   */
  async sendResetTokenEmail(user) {
    const email = new Email();

    email
      .setFrom(await getEmailAddressInConfigFile())
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
 * Class representing an Email, which can be sent
 * by the EmailService in the sendMail method.
 */
class Email {
  /**
   * Create an instance of Email.
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
   * Set the from address of the email.
   *
   * @param {string} from - Email of the sender.
   * @returns {Object} - Return this to allow chaining.
   */
  setFrom(from) {
    this.from = from.trim();
    return this;
  }

  /**
   * Set the subject of the email.
   *
   * @param {string} subject - Subject of the email.
   * @returns {this} - Return this to allow chaining.
   */
  setSubject(subject) {
    this.subject = subject;
    return this;
  }

  /**
   * Set the HTML content of the email.
   *
   * @param {string} html - HTML content to be inserted into the email body.
   * @returns {this} - Return this to allow chaining.
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
   */
  setHtml(html) {
    this.html = html;
    return this;
  }

  /**
   * Set the text content of the email.
   *
   * @param {string} text - Text content to be inserted into the email body.
   * @returns {this} - Returns 'this' to allow chaining.
   */
  setText(text) {
    this.text = text;
    return this;
  }

  /**
   * Add an attachment to the email, allowing multiple attachments by invoking the method again.
   *
   * @param {string} path - Path to the file on the computer.
   * @param {string} [filename] - File name (optional).
   * @returns {this} - Returns 'this' to allow chaining.
   * @throws {ApiValidationError} - Exception containing the validation error.
   *
   * @example
   * const email = new Email();
   * email.addAttachment('C:\RelatorioBancario.xls', 'Relatório bancário');
   */
  addAttachment(path, filename) {
    if (validator.isEmpty(path)) {
      throw new ApiValidationError(
        ErrorMessageFormatter.missingArgument("path"),
      );
    }

    if (!fs.existsSync(path)) {
      throw new ApiInvalidFileError(
        errorConsts.ERROR_FILE_NOT_FOUND.replace("{placeholder}", path),
      );
    }

    const attachment = {
      path: path,
    };

    // Use conditional assignment to create the property only if 'filename' has a value
    filename !== undefined && (attachment["filename"] = filename);

    this.attachments.push(attachment);

    return this;
  }

  /**
   * Add a recipient email address. You can add multiple email addresses by invoking the method multiple times
   * or by providing a comma-separated string of email addresses.
   *
   * @param {string} emailAddress - Destination email address.
   * @returns {this} - Returns 'this' to allow chaining.
   * @throws {ApiValidationError} - Exception containing the validation error.
   *
   * @example
   * const email = new Email();
   * email.addReceiverAddress('projetomycash@gmail.com');
   */
  addReceiverAddress(emailAddress) {
    if (validator.isEmpty(emailAddress)) {
      throw new ApiValidationError(
        ErrorMessageFormatter.missingArgument("emailAdress"),
      );
    }

    if (!validator.isEmail(emailAddress)) {
      throw new ApiValidationError(
        emailConsts.ERROR_INVALID_EMAIL.replace("{placeholder}", emailAddress),
      );
    }

    // Check if there is already an address, if so, add with "," to maintain the formatting
    this.to += this.hasReceiverAddress() ? `, ${emailAddress}` : emailAddress;

    return this;
  }

  /**
   * Check if a recipient email address is set.
   *
   * @returns {boolean} - Boolean indicating if a recipient email address is set.
   */
  hasReceiverAddress() {
    return this.to.length > 0;
  }

  /**
   * Method to validate the information contained in its instance.
   *
   * @returns {void}
   * @throws {ApiValidationError} - Exception containing the validation errors.
   * @example
   * const email = new Email();
   * email.validate(); // Output: ApiValidationError due to not having valid data.
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
