class ApiValidationResult {
   constructor() {
      this.errors = [];
   }

   addError(error) {
      if (!error) {
         return
      }

      this.errors.push(error);
   }

   getErrors() {
      return this.errors;
   }

   isEmpty() {
      return (this.errors.length === 0);
   }
}

module.exports = ApiValidationResult;