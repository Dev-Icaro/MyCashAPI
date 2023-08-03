class AccountBalanceError extends Error {
  constructor(message, errors) {
    super(message);
    this.errors = errors;
    this.name = "AccountBalanceError";
  }
}

module.exports = { AccountBalanceError };
