const errorConstants = require('../constants/error-constants');
const { isNumber, validateEmailFormat } = require('../validators/generic-validators.js');

class ConfigValidator {
   constructor() {
      this.errors = [];
   }

   isDataValid() {
      return this.errors.length === 0;
   }

   getErrors() {
      return this.errors;
   }
}

module.exports = ConfigValidator