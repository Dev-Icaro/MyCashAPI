// Service
const AuthService = require("../services/auth-service");

// Cosntants
const authConsts = require('../constants/auth-constants');
const errorsConsts = require('../constants/error-constants');
const emailConsts = require("../constants/email-constants");

// Helpers / Utils
const logger = require('../utils/logger');

// Validators
const { validationResult } = require('express-validator');

class AuthController {
   static async signup(req, res) {
      try {
         let createdUser = await AuthService.signup(req.body);
         return res.status(200).json({ message: authConsts.SIGNUP_SUCCESS, user: createdUser });
      }
      catch (e) {
         switch (e.name) {
            case 'ApiValidationError': {
               return res.status(400).json({ message: e.message, errors: e.errors });
            }
            case 'ApiUniqueConstraintError': {
               return res.status(409).json({ message: e.message, errors: e.errors });
            }
            default: {
               logger.error('Error during sigup:\n', e);
               return res.status(500).json({ message: e.message });
            }
         }
      }
   }

   static async signin(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: errorsConsts.MSG_VALIDATION_ERROR, errors: errors.array() });
         }

         let authToken = await AuthService.signin(req.body);
         return res.status(200).json({ message: authConsts.SIGNIN_SUCCESS, token: authToken });
      }
      catch(e) {
         if (e.name === 'ApiUnauthorizedError') {
            return res.status(401).json({ message: e.message, errors: e.errors });
         }
         else {
            logger.error('Error during sigin:\n', e);
            return res.status(500).json({ message: e.message });
         }
         
      }
   }

   static async forgotPassword(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({ message: errorsConsts.MSG_VALIDATION_ERROR, errors: errors.array() });
         }

         await AuthService.forgotPassword(req.body.email);
         return res.status(200).json({ message: emailConsts.EMAIL_RESET_TOKEN_SUCCESS });
      }  
      catch(e) {
         switch(e.name) {
            case "ApiEmailConfigurationError": {
               return res.status(400).json({ message: e.message, errors: e.errors });
            }
            default: {
               logger.error(e.message);
               return res.status(500).json({ message: e.message });
            }
         }
      }
   }
}

module.exports = AuthController;