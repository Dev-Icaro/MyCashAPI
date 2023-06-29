const { body } = require('express-validator');
const { ERROR_USER_NOT_FOUND } = require('../constants/user-constants.js');
const errorsConsts = require('../constants/error-constants.js')
const models = require('../models');
const User = models.User;

const validateSigin = () => [
   validateEmail(),
   body('password')
      .exists().withMessage(errorsConsts.ERROR_REQUIRED_FIELD.replace('{placeholder}', 'password')).bail()
      .trim()
      .notEmpty().withMessage(errorsConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', 'password'))
];

const validateEmail = () => 
   body('email')
      .exists().withMessage(errorsConsts.ERROR_REQUIRED_FIELD.replace('{placeholder}', 'email')).bail()
      .trim()
      .notEmpty().withMessage(errorsConsts.ERROR_EMPTY_FIELD.replace('{placeholder}', 'email')).bail()
      .isEmail().withMessage(errorsConsts.ERROR_INVALID_FORMAT.replace('{placeholder}', 'email')).bail()
      .custom(async value => {
         if (!await User.findByEmail(value)) 
            throw ERROR_USER_NOT_FOUND;
   });

module.exports = { validateSigin, validateEmail };