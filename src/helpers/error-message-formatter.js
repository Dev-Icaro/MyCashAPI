const errorConsts = require("../constants/error-constants");
const emailConsts = require("../constants/email-constants");

class ErrorMessageFormatter {
  static formatNotNullErr(placeholderValue) {
    return errorConsts.ERROR_NOT_NULL.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatNotEmptyErr(placeholderValue) {
    return errorConsts.ERROR_NOT_EMPTY.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatNotIntegerErr(placeholderValue) {
    return errorConsts.ERROR_NOT_INT.replace("{placeholder}", placeholderValue);
  }

  static formatNotFoundErr(placeholderValue) {
    return errorConsts.ERROR_NOT_FOUND.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatNotFloatErr(placeholderValue) {
    return errorConsts.ERROR_NOT_FLOAT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatNotNumericErr(placeholderValue) {
    return errorConsts.ERROR_NOT_NUMERIC.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatInvalidFormatErr(placeholderValue) {
    return errorConsts.ERROR_INVALID_FORMAT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatInvalidEmailErr(placeholderValue) {
    return emailConsts.ERROR_INVALID_EMAIL.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatMissingParamErr(placeholderValue) {
    return errorConsts.ERROR_MISSING_PARAM.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatMissingArgumentErr(placeholderValue) {
    return errorConsts.ERROR_MISSING_ARGUMENT.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatInvalidDateTimeErr(placeholderValue) {
    return errorConsts.ERROR_INVALID_DATE_TIME.replace(
      "{placeholder}",
      placeholderValue,
    );
  }

  static formatNotAlphanumericErr(placeholderValue) {
    return errorConsts.ERROR_NOT_ALPHANUMERIC.replace(
      "{placeholder}",
      placeholderValue,
    );
  }
}

module.exports = ErrorMessageFormatter;
