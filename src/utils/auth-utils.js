const jwt = require('jsonwebtoken');
const dateUtils = require('../utils/date-utils');

function generateToken(payload) {
   return jwt.sign(payload, process.env.API_SECRET);
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
      resetToken: token,
      resetTokenExpiration: dateUtils.formatMySqlDateTime(tokenExpiration)
   }

   return resetToken;
}

module.exports = { generateToken, verifyToken, generateResetToken };
