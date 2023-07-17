const logger = require("../utils/logger");
const errorConsts = require("../constants/error-constants");

function errorHandler(err, req, res, next) {
   logger.error(errorConsts.ERROR_REQUEST_FAIL, err);
   return res.status(500).json({ message: err.message });
}

function validationErrorHandler(err, req, res, next) {
   switch (err.name) {
      case "ApiValidationError": {
         return res
            .status(400)
            .json({ message: err.message, errors: err.errors });
      }
      case "ApiUniqueConstraintError": {
         return res
            .status(409)
            .json({ message: err.message, errors: err.errors });
      }
      default: {
         next(err);
      }
   }
}

function emailErrorHandler(err, req, res, next) {
   switch (err.name) {
      case "ApiEmailConfigurationError": {
         return res
            .status(400)
            .json({ message: err.message, errors: err.errors });
      }
      default: {
         next(err);
      }
   }
}

function authErrorHandler(err, req, res, next) {
   switch (err.name) {
      case "ApiUnauthorizedError": {
         return res
            .status(401)
            .json({ message: err.message, errors: err.errors });
      }
      case "ApiUnauthorizedResetPassError": {
         return res
            .status(401)
            .json({ message: err.message, errors: err.errors });
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
