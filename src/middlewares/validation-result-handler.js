const errorConsts = require("../constants/error-constants");
const { validationResult } = require("express-validator");

/**
 * Handle the validation result of express-validator.
 *
 * @param {Express.Request} req - The Express request object.
 * @param {Express.Response} res - The Express response object.
 * @param {Express.NextFunction} next - The next middleware on the chain.
 */
function validationResultHandler(req, res, next) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: errorConsts.MSG_VALIDATION_ERROR,
      errors: errors.array(),
    });
  }

  next();
}

module.exports = validationResultHandler;
