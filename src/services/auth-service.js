// Helpers / Utils
const { isHashEqual } = require('../utils/crypt-utils');
const { generateResetToken, generateAuthToken } = require('../utils/auth-utils');
const SequelizeErrorWrapper = require('../helpers/sequelize-error-wrapper');

// Errors
const { ApiUnauthorizedError } = require('../errors/auth-errors');

// Services
const EmailService = require('../services/email-service');

//Constants
const authConsts = require('../constants/auth-constants');

// Models
const models = require('../models');
const User = models.User;

class AuthService {
   static async signup(user) {
      return await User.create(user)
         .then((createdUser) => {
            return createdUser;
         })
         .catch((e) => {
            SequelizeErrorWrapper.wrapError(e);
         });
   }

   static async signin(credentials) {
      let user = await User.findUserByEmail(credentials.email);

      if (!await isHashEqual(credentials.password, user.password)) {
         throw new ApiUnauthorizedError(authConsts.MSG_UNAUTHORIZED_SIGIN, [ authConsts.MSG_INCORRECT_PASSWORD ]);
      }
      const authToken = generateAuthToken(user);
      return authToken;
   }

   static async forgotPassword(email) {
      // Gero o reset token e guardo no banco
      let user = await User.findUserByEmail(email);
      let resetToken = generateResetToken();

      user.resetToken           = resetToken.token;
      user.resetTokenExpiration = resetToken.expiration;

      await user.save();

      let emailInfo = await EmailService.sendResetTokenEmail(user);
      return emailInfo;
   }
}

module.exports = AuthService;