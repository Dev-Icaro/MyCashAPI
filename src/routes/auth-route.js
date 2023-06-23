const { Router } = require('express');
const AuthController = require('../controllers/auth-controller');

const router = Router();

router.post('/api/auth/signup', AuthController.signup);
router.post('/api/auth/sigin', AuthController.signin);
router.post('/api/auth/forgotPassword/:email', AuthController.forgotPassword)

module.exports = router;