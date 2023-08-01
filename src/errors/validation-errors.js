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

class ApiNotFoundError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "ApiNotFoundError";
  }
}

module.exports = {
  ApiUniqueConstraintError,
  ApiValidationError,
  ApiNotFoundError,
};
