class ApiValidationError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiValidationError';
   }
}

class ApiUniqueConstraintError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiUniqueConstraintError';
   }
}

class ApiUnauthorizedError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiUnauthorizedError'
   }
}

module.exports = { ApiValidationError, ApiUniqueConstraintError, ApiUnauthorizedError};