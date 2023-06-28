const errorsConsts = require('../constants/error-constants');
const emailConfigConsts = require('../constants/email-config-constants');
const models = require('../models');
const EmailConfig = models.EmailConfig;
const { param } = require('express-validator');

const validateEmailConfigParam = () => [
   param('id')
      .exists().withMessage(errorsConsts.ERROR_REQUIRED_PARAM.replace('{param}', 'id')).bail()
      .trim()
      .notEmpty().withMessage(errorsConsts.ERROR_EMPTY_FIELD).bail()
      .isInt().withMessage(errorsConsts.ERROR_NOT_INT.replace('{placeholder}', 'id')).bail()
      .custom(async id => {
        if (!await EmailConfig.getEmailConfigById(id))
            throw new Error(emailConfigConsts.EMAIL_CONFIG_NOT_FOUND.replace('{id}', id));
      })
]

module.exports = { validateEmailConfigParam };