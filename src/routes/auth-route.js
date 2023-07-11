const { Router } = require("express");
const AuthController = require("../controllers/auth-controller");
const {
   validateSiginReq,
   validateEmail,
   validateResetPassReq,
} = require("../validators/auth-validator");

const router = Router();

router.post("/api/auth/signup", AuthController.signup);

router.post("/api/auth/signin", validateSiginReq(), AuthController.signin);

router.post(
   "/api/auth/forgot-password",
   validateEmail(),
   AuthController.forgotPassword
);

router.post(
   "/api/auth/reset-password",
   validateResetPassReq(),
   AuthController.resetPassword
);

module.exports = router;
