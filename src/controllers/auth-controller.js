const AuthService = require("../services/auth-service");
const authConsts = require('../constants/auth-constants');
const errorsConsts = require('../constants/error-constants');
const logger = require('../utils/logger');
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

         let serviceResponse = await AuthService.forgotPassword(req.params.email);
         return res.status(serviceResponse.statusCode).json(serviceResponse);
      }  
      catch(e) {
         console.log(e.message);
         return res.status(500).json(e.message);
      }
   }
}

module.exports = AuthController;