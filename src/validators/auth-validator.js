const { Validator } = require('./validator.js');
const { ApiValidationError } = require('../errors');
const { body } = require('express-validator');
const { ERROR_USER_NOT_FOUND } = require('../constants/user-constants.js');
const errorsConsts = require('../constants/error-constants.js')
const models = require('../models');
const User = models.User;

const validateSigin = () => [
   validateEmail(),
   body('password')
      .exists().withMessage(errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'password')).bail()
      .trim()
      .notEmpty().withMessage(errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'password'))
];

const validateEmail = () => 
   body('email')
      .exists().withMessage(errorsConsts.ERROR_REQUIRED_FIELD.replace('{field}', 'email')).bail()
      .trim()
      .notEmpty().withMessage(errorsConsts.ERROR_EMPTY_FIELD.replace('{field}', 'email')).bail()
      .isEmail().withMessage(errorsConsts.ERROR_INVALID_FORMAT.replace('{field}', 'email')).bail()
      .custom(async value => {
         if (!await User.findByEmail(value)) 
            throw ERROR_USER_NOT_FOUND;
   });


class AuthValidator extends Validator {
   static async validateCredentials(credentials) {
      const errors = [];
      let email = credentials.email;
      let pass = credentials.password;

      try {
         // await this.validateEmail(email);
         // this.validatePassword(pass);
      } 
      catch (e) {

      }

      if (errors.length() > 0) 
         throw new ApiValidationError(errorsConsts.MSG_VALIDATION_ERROR, errors);
   }
}

module.exports = { AuthValidator, validateSigin, validateEmail };