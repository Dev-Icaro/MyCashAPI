class ApiInvalidFileError extends Error {
   constructor(message, errors) {
      super(message);
      this.errors = errors;
      this.name = 'ApiInvalidFileError'
   }
}

module.exports = { ApiInvalidFileError };