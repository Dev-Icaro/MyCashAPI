const ConfigController = require('../controllers/config-controller');
const { Router } = require('express');

const router = Router();

router.get('/api/auth/config/email/:id', ConfigController.getEmailConfig)
router.post('/api/auth/config/email', ConfigController.createEmailConfig)

module.exports = router;