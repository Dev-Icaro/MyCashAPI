const { Router } = require("express");
const AuthController = require("../controllers/auth-controller");
const {
  validateSiginReq,
  validateEmail,
  validateResetPassReq,
} = require("../validators/auth-validator");
const {
  validationErrorHandler,
  authErrorHandler,
  emailErrorHandler,
} = require("../middlewares/error-handlers");
const validationResultHandler = require("../middlewares/validation-result-handler");

const router = Router();

router.post("/api/auth/signup", AuthController.signup, validationErrorHandler);

router.post(
  "/api/auth/signin",
  validateSiginReq(),
  validationResultHandler,
  AuthController.signin,
  authErrorHandler,
);

router.post(
  "/api/auth/forgot-password",
  validateEmail(),
  validationResultHandler,
  AuthController.forgotPassword,
  emailErrorHandler,
);

router.post(
  "/api/auth/reset-password",
  validateResetPassReq(),
  validationResultHandler,
  AuthController.resetPassword,
  authErrorHandler,
);

module.exports = router;
