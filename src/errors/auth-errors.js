class ApiUnauthorizedError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = "ApiUnauthorizedError";
   }
}

class ApiUnauthorizedResetPassError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = "ApiUnauthorizedResetPassError";
   }
}

module.exports = { ApiUnauthorizedError, ApiUnauthorizedResetPassError };
