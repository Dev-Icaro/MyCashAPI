// Helpers / Utils
const { isHashEqual } = require('../utils/bcrypt-utils');
const { generateResetToken, generateAuthToken } = require('../utils/auth-utils');

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
      // Gera o token e guarda no banco
      //let resetToken = generateResetToken();

      let user = await User.findUserByEmail(email);
      let resetToken = generateResetToken();

      user.resetToken           = resetToken.token;
      user.resetTokenExpiration = resetToken.expiration;

      await user.save();

      // await User.update(resetToken, {
      //     where: {
      //        email: String(email) 
      //    }
      // });

      let emailInfo = await EmailService.sendResetTokenEmail(user);
      return emailInfo;
   }
}

module.exports = AuthService;