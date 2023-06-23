const { validateEmailFormat } = require('./generic-validators.js');
const { verifyToken } = require('../utils/auth-utils');
const { checkRegExists } = require('../utils/model-utils.js');
const { ERROR_MISSING_FIELD, ERROR_INVALID_FORMAT } = require('../constants/error-constants.js');
const { MSG_INVALID_AUTH_FORMAT, MSG_AUTH_HEADER_MISSING, MSG_INVALID_TOKEN } = require('../constants/auth-constants');
const { ERROR_USER_NOT_FOUND } = require('../constants/user-constants.js');

class AuthValidator {
   constructor() {
      this.errors = [];
   }

   isDataValid() {
      return this.errors.length === 0;
   }

   getErrors() {
      return this.errors;
   }

   async validateEmail(email) {
      if (!email) 
         this.errors.push(ERROR_MISSING_FIELD + 'email');
   
      if (!validateEmailFormat(email))
         this.errors.push(ERROR_INVALID_FORMAT + 'email');

      let where = { email: String(email) }
      if (!await checkRegExists('users', where)) 
         this.errors.push(ERROR_USER_NOT_FOUND);
   }    

   async validatePassword(password) {
      if (!password) 
         this.errors.push(ERROR_MISSING_FIELD + 'password');
   }

   validateAuthorization(authorization) {
      if (!authorization) 
         return this.errors.push(MSG_AUTH_HEADER_MISSING);

      let authValues = authorization.split(' ');

      if (!this.isAuthFormatValid(authValues))
         return this.errors.push(MSG_INVALID_AUTH_FORMAT);

      let token = authValues[1];

      if (!verifyToken(token))
         return this.errors.push(MSG_INVALID_TOKEN);
   }

   isAuthFormatValid(authValues) {
      return authValues.length === 2 && authValues[0] === 'Bearer'
   }
}

module.exports = AuthValidator;