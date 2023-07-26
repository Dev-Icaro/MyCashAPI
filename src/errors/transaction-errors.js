class ApiInvalidTransactionTypeError extends Error {
  constructor(message) {
    super(message);
    this.name = "ApiInvalidTransactionTypeError";
  }
}

module.exports = { ApiInvalidTransactionTypeError };
