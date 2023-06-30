const jwt = require('jsonwebtoken');
const dateUtils = require('../utils/date-utils');

function generateToken(payload) {
   return jwt.sign(payload, process.env.API_SECRET, { expiresIn: '1h' });
};

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
