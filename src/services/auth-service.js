// Requires
const { isHashEqual } = require('../utils/bcrypt-utils');
const { generateResetToken, generateAuthToken } = require('../utils/auth-utils');
const { ApiUnauthorizedError } = require('../errors');
const { SequelizeErrorWrapper } = require('../helpers/sequelize-error-wrapper');
const authConsts = require('../constants/auth-constants');
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
      let user = await User.findByEmail(credentials.email);

      if (!await isHashEqual(credentials.password, user.password)) {
         throw new ApiUnauthorizedError(authConsts.MSG_UNAUTHORIZED_SIGIN, [ authConsts.MSG_INCORRECT_PASSWORD ]);
      }
      const authToken = generateAuthToken(user);
      return authToken;
   }

   static async forgotPassword(email) {
      // Gera o token e guarda no banco
      let resetToken = generateResetToken();
      await User.update(resetToken, {
          where: {
             email: String(email) 
         }
      });

   
      return { statusCode: 200, message: MSG_FORGOT_PASS_EMAIL_SENT };
   }
}

module.exports = AuthService;