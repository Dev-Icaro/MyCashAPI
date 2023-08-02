// Errors
const {
  ApiUniqueConstraintError,
  ApiValidationError,
} = require("../errors/validation-errors");

// Constants
const errorsConsts = require("../constants/error-constants");

/**
 * Wrapper for Sequelize errors, the idea is to encapsulate the errors to reduce
 * dependencies on other libraries and promote best practices. Thanks Uncle Bob (Robert Cecil Martin).
 */
class SequelizeErrorWrapper {
  /**
   * Encapsulates an error, directing it to its respective wrapper method.
   *
   * @param {SequelizeError} e - The error to be wrapped.
   */
  static wrapError(e) {
    switch (e.name) {
      case "SequelizeValidationError": {
        this.wrapValidationError(e);
        break;
      }
      case "SequelizeUniqueConstraintError": {
        this.wrapUniqueConstraintError(e);
        break;
      }
      default: {
        throw e;
      }
    }
  }

  /**
   * Encapsulates a SequelizeValidationError, extracting relevant information and
   * rethrowing it as a standard API validation error.
   *
   * @param {SequelizeValidationError} e - The sequelize validation error.
   * @throws {ApiValidationError} - The encapsulated error.
   */
  static wrapValidationError(e) {
    const validationErrors = e.errors.map((err) => err.message);
    throw new ApiValidationError(
      errorsConsts.MSG_VALIDATION_ERROR,
      validationErrors,
    );
  }

  /**
   * Encapsulates a SequelizeUniqueCosnstraintError, extracting relevant information and
   * rethrowing it as a standard API unique constraint error.
   *
   * @param {SequelizeUniqueConstraintError} e - The sequelize unique constraint error.
   * @throws {ApiUniqueConstraintError} - The encapsulated error.
   */
  static wrapUniqueConstraintError(e) {
    const invalidFields = e.errors.map((err) =>
      errorsConsts.ERROR_UNIQUE_CONSTRAINT.replace("{path}", err.path).replace(
        "{value}",
        err.value,
      ),
    );
    throw new ApiUniqueConstraintError(
      errorsConsts.MSG_UNIQUE_CONSTRAINT_ERROR,
      invalidFields,
    );
  }
}

module.exports = SequelizeErrorWrapper;
