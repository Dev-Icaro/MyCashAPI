const AuthService = require("../services/auth-service");
const authConsts = require("../constants/auth-constants");
const emailConsts = require("../constants/email-constants");

/**
 * Authentication Controller.
 * All methods of this class follow the same pattern: they take the validated request and pass it
 * to the service layer.
 */
class AuthController {
  /**
   * Signup a new user.
   *
   * @param {Express.Request} req - Request containing user information to be created.
   * @param {Express.Response} res - Response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Express.Response} - Returns different values depending on the function flow.
   */
  static async signup(req, res, next) {
    try {
      const createdUser = await AuthService.signup(req.body);
      return res
        .status(200)
        .json({ message: authConsts.SIGNUP_SUCCESS, user: createdUser });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Sign in an existing user.
   *
   * @param {Express.Request} req - Request containing user credentials to sign in.
   * @param {Express.Response} res - Response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Express.Response} - Returns different values depending on the function flow.
   */
  static async signin(req, res, next) {
    try {
      const authToken = await AuthService.signin(req.body);
      return res
        .status(200)
        .json({ message: authConsts.SIGNIN_SUCCESS, token: authToken });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Send reset password token to user's email.
   *
   * @param {Express.Request} req - Request containing user email to send reset token.
   * @param {Express.Response} res - Response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Express.Response} - Returns different values depending on the function flow.
   */
  static async forgotPassword(req, res, next) {
    try {
      await AuthService.forgotPassword(req.body.email);
      return res
        .status(200)
        .json({ message: emailConsts.EMAIL_RESET_TOKEN_SUCCESS });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Reset user's password using the provided reset token.
   *
   * @param {Express.Request} req - Request containing: {email, token, password}.
   * @param {Express.Response} res - Response object.
   * @param {import("express").NextFunction} next - The next function to call.
   * @returns {Express.Response} - Returns different values depending on the function flow.
   */
  static async resetPassword(req, res, next) {
    try {
      await AuthService.resetPassword(req.body);
      return res.status(200).json({ message: authConsts.RESET_PASS_SUCESS });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = AuthController;
