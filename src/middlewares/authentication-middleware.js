// Utils
const { verifyToken } = require("../utils/auth-utils");

// Constants
const authConsts = require("../constants/auth-constants");

/**
 * Authentication middleware.
 *
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The next function to call.
 * @returns {void} - Returns a response with an error or calls next, depending
 * on the function flow.
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

  try {
    const decoded = await verifyToken(token);
    // Store the userId in a shared context.
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    const errMessage =
      err.name === "TokenExpiredError"
        ? authConsts.ERROR_TOKEN_EXPIRED
        : authConsts.MSG_INVALID_TOKEN;

    return res.status(401).json({ message: errMessage });
  }
}

function isAuthFormatValid(authValues) {
  return authValues.length === 2 && authValues[0] === "Bearer";
}

module.exports = authenticationMiddleware;
