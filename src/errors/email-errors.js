class ApiEmailSendError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiEmailSendError'
   }
}

class ApiEmailConfigurationError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiEmailConfigurationError'
   }
}

module.exports = { ApiEmailSendError, ApiEmailConfigurationError };