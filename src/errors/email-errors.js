class ApiEmailSendError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiEmailSendError'
   }
}

module.exports = { ApiEmailSendError };