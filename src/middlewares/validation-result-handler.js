const errorConsts = require("../constants/error-constants");
const { validationResult } = require("express-validator");

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
