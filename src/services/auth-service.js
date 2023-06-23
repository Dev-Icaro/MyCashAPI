// Requires
const { MSG_USER_CREATED, ERROR_USER_NOT_FOUND }             = require('../constants/user-constants');
const { MSG_INCORRECT_PASSWORD, MSG_FORGOT_PASS_EMAIL_SENT } = require('../constants/auth-constants');
const { ERROR_MISSING_FIELD, ERROR_INVALID_INPUT }                                = require('../constants/error-constants');
const { hashString, isHashEqual }                            = require('../utils/bcrypt-utils');
const { generateToken, generateResetToken }                  = require('../utils/auth-utils');
const UserValidator                                          = require('../validators/user-validator');
const AuthValidator                                          = require('../validators/auth-validator');

const DataBase                                               = require('../models');
const { ApiValidationError } = require('../errors');
const User = DataBase.users;

class AuthService {
   static async signup(user) {
      user = User.build(user);

      await user.validate()
         .then(async () => {
            user.password = await hashString(user.password);
            return User.create(user);
         })
         .catch((e) => {
            if (e.name === 'SequelizeValidationError') {
               // Wrap the exception throwed by sequelize
               const validationErrors = e.errors.map((err) => err.message);
               throw new ApiValidationError(e.message, validationErrors);  
            } 
            else {
               throw e;
            }
         });
   }

   static async signin(credentialsJson) {
      let validator = new AuthValidator();

      await validator.validateEmail(credentialsJson.email);
      validator.validatePassword(credentialsJson.password);

      if (!validator.isDataValid())
         return { statusCode: 400, message: validator.getErrors() };

      let user = await User.findByEmail(credentialsJson.email);

      if (!await isHashEqual(credentialsJson.password, user.password)) 
         return { statusCode: 401, message: MSG_INCORRECT_PASSWORD };

      let payload = {
         id: user.id,
         username: user.username,
         tokenType: 'auth'
      }
      let token = generateToken(payload);

      return { statusCode: 200, token };
   }

   static async forgotPassword(email) {
      let validator = new AuthValidator();
      await validator.validateEmail(email);

      if (!validator.isDataValid())
         return { statusCode: 400, message: validator.getErrors() };

      // Generate reset token and store it on DB
      let resetToken = generateResetToken();
      await User.update(resetToken, { where: { email: String(email) }});

      return { statusCode: 200, message: MSG_FORGOT_PASS_EMAIL_SENT };
   }
}

module.exports = AuthService;