const EmailConfigController = require('../controllers/email-config-controller');
const { validateEmailConfigParam } = require('../validators/email-config-validator');
const { Router } = require('express');

const router = Router();

// Email config 
router.route('/api/config/email')
   .get(EmailConfigController.getAllEmailConfigs)
   .post(EmailConfigController.createEmailConfig);

router
   .get('/api/config/email/:id',
      validateEmailConfigParam(),
      EmailConfigController.getEmailConfigById
   )
   



module.exports = router;