const { Router } = require('express');
const AuthController = require('../controllers/auth-controller');

const router = Router();

router.post('/api/auth/register', AuthController.registerUser);
router.post('/api/auth/login', AuthController.login);

module.exports = router;