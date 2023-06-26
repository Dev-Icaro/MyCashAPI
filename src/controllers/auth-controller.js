const AuthService = require("../services/auth-service");
const authConstants = require('../constants/auth-constants');
const logger = require('../utils/logger');

class AuthController {
   static async signup(req, res) {
      try {
         let createdUser = await AuthService.signup(req.body);
         return res.status(200).json({ message: authConstants.SIGNUP_SUCCESS, user: createdUser });
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
         let serviceResponse = await AuthService.signin(req.body);
         return res.status(serviceResponse.statusCode).json(serviceResponse);
      }
      catch(e) {
         console.log(e.message);
         return res.status(500).json(e.message);
      }
   }

   static async forgotPassword(req, res) {
      try {
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