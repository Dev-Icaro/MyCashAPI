const jwt = require('jsonwebtoken');
const dateUtils = require('../utils/date-utils');

/**
 * Gera JWT's.
 * 
 * @param {Object} payload - Objecto contendo o payload que sera. 
 * usado na geração do jwt.
 * @returns {string} - JWT gerado.
 * 
 * @example 
 * const authToken = generateToken(authPayload);
 */
function generateToken(payload) {
   return jwt.sign(payload, process.env.API_SECRET, { expiresIn: '1h' });
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
   try {
      jwt.verify(token, process.env.API_SECRET);
      return true;
   }
   catch(e) {
      console.log(e);
      return false;
   }
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
      expiration: dateUtils.formatMySqlDateTime(tokenExpiration)
   }

   return resetToken;
}

/**
 * Gera um token de autenticação baseado nas informações de um
 * usuário
 * 
 * @param {Object} user - Recebe uma instância do model User.
 * @returns {string} - Token de autenticação.
 */
function generateAuthToken(user) {
   const payload = {
      id: user.id,
      username: user.username,
      tokenType: 'auth'
   }
   let authToken = generateToken(payload);

   return authToken;
}

module.exports = { generateToken, verifyToken, generateResetToken, generateAuthToken };
