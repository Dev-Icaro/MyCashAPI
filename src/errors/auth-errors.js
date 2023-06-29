class ApiUnauthorizedError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiUnauthorizedError'
   }
}

module.exports = { ApiUnauthorizedError }