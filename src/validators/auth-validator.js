const { Validator } = require('./validator.js');
const { verifyToken } = require('../utils/auth-utils');
const { checkRegExists } = require('../utils/model-utils.js');
const { ApiValidationError } = require('../errors');
const { errorsConsts } = require('../constants/error-constants.js')
const { MSG_INVALID_AUTH_FORMAT, MSG_AUTH_HEADER_MISSING, MSG_INVALID_TOKEN } = require('../constants/auth-constants');
const { ERROR_USER_NOT_FOUND } = require('../constants/user-constants.js');
const { ApiValidationError } = require('../errors/index.js');

class AuthValidator extends Validator {
   static validateAuthorization(authorization) {
      if (!authorization) 
         return this.errors.push(MSG_AUTH_HEADER_MISSING);

      let authValues = authorization.split(' ');

      if (!this.isAuthFormatValid(authValues))
         return this.errors.push(MSG_INVALID_AUTH_FORMAT);

      let token = authValues[1];

      if (!verifyToken(token))
         return this.errors.push(MSG_INVALID_TOKEN);
   }

   static isAuthFormatValid(authValues) {
      return authValues.length === 2 && authValues[0] === 'Bearer'
   }

   static async validateCredentials(credentials) {
      const errors = [];
      let email = credentials.email;
      let pass = credentials.password;

      try {
         await this.validateEmail(email);
         this.validatePassword(pass);
      } 
      catch (e) {

      }

      if (errors.length() > 0) 
         throw new ApiValidationError(errorsConsts.MSG_VALIDATION_ERROR, errors);
   }

   static async validateEmail(email) {
      if (this.isNull(email))
         errors.push(errorsConsts.ERROR_NULL_FIELD.replace('{field}', 'email'));

      if (this.isEmpty(email))
         errors.push(errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'email'));
   
      if (!this.isEmail(email))
         errors.push(errorsConsts.ERROR_INVALID_FORMAT.replace('{field}', 'email'));

      if (!await checkRegExists('User', { email: String(email) })) 
         errors.push(ERROR_USER_NOT_FOUND);
   }    

   static async validatePassword(password) {
      if (this.isNull(password)) 
         this.errors.push(errorsConsts.ERROR_NULL_FIELD.replace('{field}', 'password'));

      if (this.isEmpty(password))
         this.errors.push(errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'password'));
   }

}

module.exports = AuthValidator;