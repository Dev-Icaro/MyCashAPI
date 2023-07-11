// Utils
const { verifyToken } = require("../utils/auth-utils");

// Constants
const authConsts = require("../constants/auth-constants");

/**
 * Middleware de autenticação.
 *
 * @param {Express.Request} req
 * @param {Express.Response} res
 * @param {Express.next} next
 * @returns {void} - Retorna uma resposta com erro ou next, dependendo
 * do fluxo que a função seguir.
 */
function authenticationMiddleware(req, res, next) {
   const authorization = req.headers.authorization;

   if (!authorization) {
      return res
         .status(400)
         .json({ message: authConsts.MSG_AUTH_HEADER_MISSING });
   }

   const authValues = authorization.split(" ");

   if (!isAuthFormatValid(authValues)) {
      return res
         .status(400)
         .json({ message: authConsts.MSG_INVALID_AUTH_FORMAT });
   }

   const token = authValues[1];

   if (!verifyToken(token)) {
      return res.status(409).json({ message: authConsts.MSG_INVALID_TOKEN });
   }

   return next();
}

function isAuthFormatValid(authValues) {
   return authValues.length === 2 && authValues[0] === "Bearer";
}

module.exports = authenticationMiddleware;
