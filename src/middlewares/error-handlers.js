const logger = require("../utils/logger");
const errorConsts = require("../constants/error-constants");

/**
 * Error handler middleware to handle and log application errors.
 *
 * @param {Error} err - The error object.
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @returns {Express.Response} - Returns a response with the error details.
 */
function errorHandler(err, req, res) {
  logger.error(errorConsts.ERROR_REQUEST_FAIL, err);
  return res.status(500).json({ message: err.message, errors: err.errors });
}

/**
 * Validation error handler middleware to handle API validation errors and respond accordingly.
 *
 * @param {Error} err - The error object.
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The next function to call.
 * @returns {Express.Response|void} - Returns a response with the error details or calls next if no matching error type found.
 */
function validationErrorHandler(err, req, res, next) {
  switch (err.name) {
    case "ApiValidationError": {
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    case "ApiUniqueConstraintError": {
      return res.status(409).json({ message: err.message, errors: err.errors });
    }
    case "ApiInvalidArgumentError": {
      return res.status(500).json({ message: err.message, errors: err.errors });
    }
    case "ApiNotFoundError": {
      return res.status(404).json({ message: err.message, errors: err.errors });
    }
    default: {
      next(err);
    }
  }
}

/**
 * Email error handler middleware to handle email-related errors and respond accordingly.
 *
 * @param {Error} err - The error object.
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The next function to call.
 * @returns {Express.Response|void} - Returns a response with the error details or calls next if no matching error type found.
 */
function emailErrorHandler(err, req, res, next) {
  switch (err.name) {
    case "ApiEmailConfigurationError": {
      logger.error(err);
      return res.status(400).json({ message: err.message, errors: err.errors });
    }
    default: {
      logger.error(err);
      next(err);
    }
  }
}

/**
 * Authentication error handler middleware to handle authentication-related errors and respond accordingly.
 *
 * @param {Error} err - The error object.
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The next function to call.
 * @returns {Express.Response|void} - Returns a response with the error details or calls next if no matching error type found.
 */
function authErrorHandler(err, req, res, next) {
  switch (err.name) {
    case "ApiUnauthorizedError": {
      return res.status(401).json({ message: err.message, errors: err.errors });
    }
    case "ApiUnauthorizedResetPassError": {
      return res.status(401).json({ message: err.message, errors: err.errors });
    }
    default: {
      next(err);
    }
  }
}

module.exports = {
  errorHandler,
  validationErrorHandler,
  emailErrorHandler,
  authErrorHandler,
};
