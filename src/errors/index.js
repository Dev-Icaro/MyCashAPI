class ApiValidationError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiValidationError';
   }
}

module.exports = { ApiValidationError };