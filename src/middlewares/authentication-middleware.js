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
async function authenticationMiddleware(req, res, next) {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return res
      .status(401)
      .json({ message: authConsts.MSG_AUTH_HEADER_MISSING });
  }

  const authValues = authorization.split(" ");

  if (!isAuthFormatValid(authValues)) {
    return res
      .status(401)
      .json({ message: authConsts.MSG_INVALID_AUTH_FORMAT });
  }

  const token = authValues[1];

  await verifyToken(token)
    .then((decoded) => {
      // Armazeno o userId em um contexto compartilhado.
      req.userId = decoded.userId;
    })
    .catch((err) => {
      const errMessage =
        err.name === "TokenExpiredError"
          ? authConsts.ERROR_TOKEN_EXPIRED
          : authConsts.MSG_INVALID_TOKEN;

      return res.status(401).json({ message: errMessage });
    });

  return next();
}

function isAuthFormatValid(authValues) {
  return authValues.length === 2 && authValues[0] === "Bearer";
}

module.exports = authenticationMiddleware;
