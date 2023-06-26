// Requires
const { MSG_INCORRECT_PASSWORD, MSG_FORGOT_PASS_EMAIL_SENT } = require('../constants/auth-constants');
const { isHashEqual }                            = require('../utils/bcrypt-utils');
const { generateToken, generateResetToken }                  = require('../utils/auth-utils');
const AuthValidator                                          = require('../validators/auth-validator');
const logger = require('../utils/logger');
const models                                               = require('../models');
const { SequelizeErrorWrapper } = require('../helpers/sequelize-error-wrapper');
const User = models.User;

class AuthService {
   static async signup(user) {
      return await User.create(user)
         .then(async (createdUser) => {
            // deleto a prop password para não retorna-la na res
            delete createdUser.dataValues.password;
            return createdUser;
         })
         .catch((e) => {
            SequelizeErrorWrapper.wrapError(e);
         });
   }

   static async signin(credentials) {
      let validator = new AuthValidator();

      await validator.validateEmail(credentials.email);
      validator.validatePassword(credentials.password);

      if (!validator.isDataValid())
         return { statusCode: 400, message: validator.getErrors() };

      let user = await User.findByEmail(credentials.email);

      if (!await isHashEqual(credentials.password, user.password)) 
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

      // Gera o token e guarda no banco
      let resetToken = generateResetToken();
      await User.update(resetToken, { where: { email: String(email) }});

      return { statusCode: 200, message: MSG_FORGOT_PASS_EMAIL_SENT };
   }
}

module.exports = AuthService;