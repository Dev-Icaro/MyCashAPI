const errorConsts = require("../constants/error-constants");
const emailConsts = require("../constants/email-constants");

class ErrorMessageFormatter {
  static notNull(placeholderValue) {
    return errorConsts.ERROR_NOT_NULL.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static notEmpty(placeholderValue) {
    return errorConsts.ERROR_NOT_EMPTY.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static notInteger(placeholderValue) {
    return errorConsts.ERROR_NOT_INT.replace("{placeholder}", placeholderValue);
  }

  static notFound(placeholderValue) {
    return errorConsts.ERROR_NOT_FOUND.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static notFloat(placeholderValue) {
    return errorConsts.ERROR_NOT_FLOAT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static notNumeric(placeholderValue) {
    return errorConsts.ERROR_NOT_NUMERIC.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static invalidFormat(placeholderValue) {
    return errorConsts.ERROR_INVALID_FORMAT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static invalidEmail(placeholderValue) {
    return emailConsts.ERROR_INVALID_EMAIL.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static missingParam(placeholderValue) {
    return errorConsts.ERROR_MISSING_PARAM.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static requiredField(placeholderValue) {
    return errorConsts.ERROR_REQUIRED_FIELD.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static missingArgument(placeholderValue) {
    return errorConsts.ERROR_MISSING_ARGUMENT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static invalidDateTime(placeholderValue) {
    return errorConsts.ERROR_INVALID_DATE_TIME.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static notAlphanumeric(placeholderValue) {
    return errorConsts.ERROR_NOT_ALPHANUMERIC.replace(
      "{placeholder}",
      placeholderValue,
    );
  }
}

module.exports = ErrorMessageFormatter;
