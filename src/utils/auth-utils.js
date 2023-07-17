const jwt = require("jsonwebtoken");
const dateUtils = require("../utils/date-utils");
const { ApiUnauthorizedResetPassError } = require("../errors/auth-errors");
const authConstants = require("../constants/auth-constants");

/**
 * Gera JWT's.
 *
 * @param {Object} payload - Objeto contendo o payload que sera.
 * usado na geração do jwt.
 * @returns {string} - JWT gerado.
 *
 * @example
 * const authToken = generateToken(authPayload);
 */
function generateToken(payload) {
   return jwt.sign(payload, process.env.API_SECRET, { expiresIn: "1h" });
}

/**
 * Verifica se é um JWT valido da API.
 *
 * @param {string} token - Token jwt que desejamos validar.
 * @returns {boolean} - Booleana indicando se o token é valido.
 *
 * @example
 * const isValidToken = verifyToken(token);
 */
function verifyToken(token) {
   return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.API_SECRET, (err, decoded) => {
         if (err) {
            reject(err);
         }

         resolve(decoded);
      });
   });
}

/**
 * Gera um reset token, que consiste em um objeto com um
 * numero randomico de 6 digitos, e uma expiração.
 *
 * @returns {Object} - Reset Token Object.
 */
function generateResetToken() {
   let token = Math.floor(100000 + Math.random() * 900000);
   let tokenExpiration = new Date();
   tokenExpiration.setMinutes(tokenExpiration.getMinutes() + 30);

   let resetToken = {
      token: token,
      expiration: dateUtils.formatMySqlDateTime(tokenExpiration),
   };

   return resetToken;
}

/**
 * Gera um token de autenticação baseado nas informações de um
 * usuário
 *
 * @param {User} user - Recebe uma instância do model User.
 * @returns {string} - Token de autenticação.
 */
function generateAuthToken(user) {
   const payload = {
      userId: user.id,
      username: user.username,
      tokenType: "auth",
   };
   let authToken = generateToken(payload);

   return authToken;
}

/**
 * Valida o ResetToken enviado por email.
 *
 * @param {string} resetToken - ResetToken enviado para o email do usuário.
 * @param {User} user - Instância do usuário que iremos validar as informações.
 * @throws {ApiUnauthorizedResetPassError} - Erro referente a inconsistência dos dados.
 */
function validateResetToken(resetToken, user) {
   const currentTime = Date.now();
   const resetTokenExpiration = user.resetTokenExpiration.getTime();

   let dif = resetTokenExpiration - currentTime;
   dif = Math.floor(dif / 60000);

   if (dif <= 0)
      throw new ApiUnauthorizedResetPassError(
         authConstants.MSG_UNAUTHORIZED_RESET_PASS,
         "The reset token expired."
      );

   if (resetToken !== user.resetToken)
      throw new ApiUnauthorizedResetPassError(
         authConstants.MSG_UNAUTHORIZED_RESET_PASS,
         "Incorrect reset token."
      );
}

module.exports = {
   generateToken,
   verifyToken,
   generateResetToken,
   generateAuthToken,
   validateResetToken,
};
