// Helpers / Utils
const { isHashEqual } = require("../utils/crypt-utils");
const {
   generateResetToken,
   generateAuthToken,
   validateResetToken,
} = require("../utils/auth-utils");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");

// Errors
const { ApiUnauthorizedError } = require("../errors/auth-errors");

// Services
const EmailService = require("../services/email-service");

//Constants
const authConsts = require("../constants/auth-constants");

// Models
const models = require("../models");
const User = models.User;

/**
 *  Serviço de Autenticação, Contém funcionalidades relacionadas.
 */
class AuthService {
   /**
    * Cria um novo usuário / Conta.
    *
    * Obs: As validações dos dados foram definidas no model, pode consulta-las no arquivo
    * models/user.js.
    *
    * Obs2: O Hashing do password também foi definido no model, utilizando os Hooks do sequelize.
    *
    * @param {User} user - JSON contendo as informações do novo usuário.
    * @returns {Promise<User>} - Retorna uma promime onde o resolve é o usuário criado.
    */
   static async signup(user) {
      return await User.create(user)
         .then((createdUser) => {
            return createdUser;
         })
         .catch((e) => {
            // Empacoto os erros lançados pelo Sequelize, incluindo os de validação.
            SequelizeErrorWrapper.wrapError(e);
         });
   }

   /**
    *  Efetua o autenticação do usuário validando suas informações e gerando um JWT.
    *
    * @param {Object} credentials - As credenciais de login {email, password}
    * @returns {string} authToken - JWT referente a autenticação.
    */
   static async signin(credentials) {
      let user = await User.findUserByEmail(credentials.email);

      if (!(await isHashEqual(credentials.password, user.password))) {
         throw new ApiUnauthorizedError(authConsts.MSG_UNAUTHORIZED_SIGIN, [
            authConsts.MSG_INCORRECT_PASSWORD,
         ]);
      }
      const authToken = generateAuthToken(user);
      return authToken;
   }

   /**
    * Método responsável por lidar com recuperação de senhas,
    * gerando um resetToken e enviando-o para o email do usuário.
    *
    * @param {string} email - Email da conta que deseja recuperar o pass.
    * @returns {Object} EmailInfo - Informações sobre o envio do email de recuperação
    */
   static async forgotPassword(email) {
      // Gero o reset token e guardo no banco
      let user = await User.findUserByEmail(email);
      let resetToken = generateResetToken();

      user.resetToken = resetToken.token;
      user.resetTokenExpiration = resetToken.expiration;

      await user.save();

      let emailInfo = await EmailService.sendResetTokenEmail(user);
      return emailInfo;
   }

   /**
    * Método responsável resetar a senha do usuário caso as informações de reset sejam
    * válidas.
    *
    * @param {Object} resetInformations - Objeto contendo email, token, nova senha.
    * @returns {void}
    */
   static async resetPassword(resetInformations) {
      const { email, token, password } = resetInformations;
      const user = await User.findUserByEmail(email);

      try {
         validateResetToken(token, user);

         user.password = password;
         await user.save();
      } catch (e) {
         throw e;
      }
   }
}

module.exports = AuthService;
