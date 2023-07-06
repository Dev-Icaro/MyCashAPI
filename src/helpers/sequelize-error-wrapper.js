// Errors
const { ApiUniqueConstraintError, ApiValidationError } = require('../errors/validation-errors');

// Constants
const errorsConsts = require('../constants/error-constants');

class SequelizeErrorWrapper {
   static wrapError(e) {
      switch (e.name) {
         case 'SequelizeValidationError': {
            this.wrapValidationError(e);
         }
         case 'SequelizeUniqueConstraintError': {
            this.wrapUniqueConstraintError(e);
         }
         default: {
            throw e;
         }  
      }
   }

   static wrapValidationError(e) {
      const validationErrors = e.errors.map((err) => err.message);
      throw new ApiValidationError(errorsConsts.MSG_VALIDATION_ERROR, validationErrors);
   }

   static wrapUniqueConstraintError(e) {
      const invalidFields = e.errors.map((err) => 
         errorsConsts.ERROR_UNIQUE_CONSTRAINT
            .replace('{path}', err.path)
            .replace('{value}', err.value));
      throw new ApiUniqueConstraintError(errorsConsts.MSG_UNIQUE_CONSTRAINT_ERROR, invalidFields);
   }
}

module.exports = SequelizeErrorWrapper;