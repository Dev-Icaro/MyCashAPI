const { verifyToken } = require('../utils/auth-utils');
const authConsts = require('../constants/auth-constants');

function authenticationMiddleware(req, res, next) {
   const authorization = req.headers.authorization;

   if (!authorization) {
      return res.status(400).json({ message: authConsts.MSG_AUTH_HEADER_MISSING });
   }

   const authValues = authorization.split(' ');

   if (!isAuthFormatValid(authValues)) {
      return res.status(400).json({ message: authConsts.MSG_INVALID_AUTH_FORMAT });
   }

   const token = authValues[1];

   if (!verifyToken(token)) {
      return res.status(409).json({ message: authConsts.MSG_INVALID_TOKEN });
   }

   return next()
}

function isAuthFormatValid(authValues) {
   return authValues.length === 2 && authValues[0] === 'Bearer'
}

module.exports = { authenticationMiddleware };
