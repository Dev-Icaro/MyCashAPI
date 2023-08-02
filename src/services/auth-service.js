const { isHashEqual } = require("../utils/crypt-utils");
const {
  generateResetToken,
  generateAuthToken,
  validateResetToken,
} = require("../utils/auth-utils");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const { ApiUnauthorizedError } = require("../errors/auth-errors");
const EmailService = require("../services/email-service");
const authConsts = require("../constants/auth-constants");
const { createTransporter } = require("../helpers/email-helpers");
const UserService = require("../services/user-service");

/**
 * Authentication service, containing related functionalities.
 */
class AuthService {
  /**
   * Create a new user/account.
   *
   * Note: Data validations are defined in the model; you can check them in the file models/user.js.
   *
   * Note2: Password hashing is also defined in the model using Sequelize Hooks.
   *
   * @param {User} user - JSON containing the information of the new user.
   * @returns {Promise<User>} - Returns a promise where the resolve is the created user.
   */
  static async signup(user) {
    return await UserService.create(user)
      .then((createdUser) => {
        return createdUser;
      })
      .catch((e) => {
        // Wrap errors thrown by Sequelize, including validation errors.
        SequelizeErrorWrapper.wrapError(e);
      });
  }

  /**
   * Authenticate the user by validating their information and generating a JWT.
   *
   * @param {Object} credentials - Login credentials {email, password}.
   * @returns {string} authToken - JWT related to the authentication.
   */
  static async signin(credentials) {
    let user = await UserService.findByEmail(credentials.email);

    if (!(await isHashEqual(credentials.password, user.password))) {
      throw new ApiUnauthorizedError(authConsts.MSG_UNAUTHORIZED_SIGIN, [
        authConsts.MSG_INCORRECT_PASSWORD,
      ]);
    }
    return generateAuthToken(user);
  }

  /**
   * Method responsible for handling password recovery,
   * generating a resetToken, and sending it to the user's email.
   *
   * @param {string} email - Email of the account requesting password recovery.
   * @returns {Object} EmailInfo - Information about the password recovery email sending.
   */
  static async forgotPassword(email) {
    // Generate the reset token and store it in the database.
    let user = await UserService.findByEmail(email);
    let resetToken = generateResetToken();

    user.resetToken = resetToken.token;
    user.resetTokenExpiration = resetToken.expiration;

    await user.save();

    const transporter = await createTransporter();
    const emailService = new EmailService(transporter);

    return await emailService.sendResetTokenEmail(user);
  }

  /**
   * Method responsible for resetting the user's password if the reset information is valid.
   *
   * @param {Object} resetInformations - Object containing email, token, new password.
   * @returns {void}
   */
  static async resetPassword(resetInformations) {
    const { email, token, password } = resetInformations;
    const user = await UserService.findByEmail(email);

    validateResetToken(token, user);

    user.password = password;
    await user.save();
  }
}

module.exports = AuthService;
