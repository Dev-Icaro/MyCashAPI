const jwt = require("jsonwebtoken");
const dateUtils = require("../utils/date-utils");
const { ApiUnauthorizedResetPassError } = require("../errors/auth-errors");
const authConstants = require("../constants/auth-constants");
const process = require("process");

/**
 * Generate JWTs.
 *
 * @param {Object} payload - An object containing the payload to be used in JWT generation.
 * @returns {string} - The generated JWT.
 *
 * @example
 * const authToken = generateToken(authPayload);
 */
function generateToken(payload) {
  return jwt.sign(payload, process.env.API_SECRET, { expiresIn: "1h" });
}

/**
 * Verify if a given token is a valid API JWT.
 *
 * @param {string} token - The JWT token to be validated.
 * @returns {boolean} - A boolean indicating whether the token is valid or not.
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
 * Generate a reset token, which consists of an object with a random 6-digit number and an expiration date.
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
 * Generate an authentication token based on user information.
 *
 * @param {User} user - An instance of the User model.
 * @returns {string} - Authentication token.
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
 * Validate the ResetToken sent by email.
 *
 * @param {string} resetToken - The ResetToken sent to the user's email.
 * @param {User} user - The user instance for validating the information.
 * @throws {ApiUnauthorizedResetPassError} - Error related to data inconsistency.
 */
function validateResetToken(resetToken, user) {
  const currentTime = Date.now();
  const resetTokenExpiration = user.resetTokenExpiration.getTime();

  let dif = resetTokenExpiration - currentTime;
  dif = Math.floor(dif / 60000);

  if (dif <= 0)
    throw new ApiUnauthorizedResetPassError(
      authConstants.MSG_UNAUTHORIZED_RESET_PASS,
      "The reset token expired.",
    );

  if (resetToken !== user.resetToken)
    throw new ApiUnauthorizedResetPassError(
      authConstants.MSG_UNAUTHORIZED_RESET_PASS,
      "Incorrect reset token.",
    );
}

module.exports = {
  generateToken,
  verifyToken,
  generateResetToken,
  generateAuthToken,
  validateResetToken,
};
