class ApiValidationError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "ApiValidationError";
  }
}

class ApiUniqueConstraintError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "ApiUniqueConstraintError";
  }
}

module.exports = { ApiUniqueConstraintError, ApiValidationError };
