const errorConsts = require("../constants/error-constants");
const emailConsts = require("../constants/email-constants");

/**
 * A utility class for formatting error messages using placeholder values.
 * @class ErrorMessageFormatter
 */
class ErrorMessageFormatter {
  /**
   * Format an error message for a not null constraint violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static notNull(placeholderValue) {
    return errorConsts.ERROR_NOT_NULL.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a not empty constraint violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static notEmpty(placeholderValue) {
    return errorConsts.ERROR_NOT_EMPTY.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a not integer constraint violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static notInteger(placeholderValue) {
    return errorConsts.ERROR_NOT_INT.replace("{placeholder}", placeholderValue);
  }

  /**
   * Format an error message for a not found constraint violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static notFound(placeholderValue) {
    return errorConsts.ERROR_NOT_FOUND.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a not float constraint violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static notFloat(placeholderValue) {
    return errorConsts.ERROR_NOT_FLOAT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a not numeric constraint violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static notNumeric(placeholderValue) {
    return errorConsts.ERROR_NOT_NUMERIC.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for an invalid format violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static invalidFormat(placeholderValue) {
    return errorConsts.ERROR_INVALID_FORMAT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for an invalid email violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static invalidEmail(placeholderValue) {
    return emailConsts.ERROR_INVALID_EMAIL.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a missing parameter violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static missingParam(placeholderValue) {
    return errorConsts.ERROR_MISSING_PARAM.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a required field violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static requiredField(placeholderValue) {
    return errorConsts.ERROR_REQUIRED_FIELD.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a missing argument violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static missingArgument(placeholderValue) {
    return errorConsts.ERROR_MISSING_ARGUMENT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for an invalid date and time violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static invalidDateTime(placeholderValue) {
    return errorConsts.ERROR_INVALID_DATE_TIME.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for a not alphanumeric constraint violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static notAlphanumeric(placeholderValue) {
    return errorConsts.ERROR_NOT_ALPHANUMERIC.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for an invalid string violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @returns {string} The formatted error message.
   */
  static invalidString(placeholderValue) {
    return errorConsts.ERROR_INVALID_STRING.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  /**
   * Format an error message for an invalid enum violation.
   *
   * @static
   * @param {string} placeholderValue - The placeholder value to be included in the error message.
   * @param {string} enumPlaceholderValue - The placeholder value for the enum value.
   * @returns {string} The formatted error message.
   */
  static invalidEnum(placeholderValue, enumPlaceholderValue) {
    return errorConsts.ERROR_INVALID_ENUM.replace(
      "{placeholder}",
      placeholderValue,
    ).replace("{enumPlaceholder}", enumPlaceholderValue);
  }
}

module.exports = ErrorMessageFormatter;
