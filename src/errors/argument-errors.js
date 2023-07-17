class ApiInvalidArgumentError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "ApiInvalidArgumentError";
  }
}

module.exports = { ApiInvalidArgumentError };
