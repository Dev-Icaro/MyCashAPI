const { Router } = require('express');
const AuthController = require('../controllers/auth-controller');
const { validateSigin, validateEmail } = require('../validators/auth-validator');

const router = Router();

router.post(
   '/api/auth/signup',
   AuthController.signup
);

router.post(
   '/api/auth/signin',
   validateSigin(),
   AuthController.signin
);

router.post(
   '/api/auth/forgotPassword',
   validateEmail(),
   AuthController.forgotPassword
);

module.exports = router;