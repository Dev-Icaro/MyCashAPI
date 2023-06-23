const AuthService = require("../services/auth-service");
const authConstants = require('../constants/auth-constants');

class AuthController {
   static async signup(req, res) {
      try {
         await AuthService.signup(req.body);
         return res.status(200).json(authConstants.SIGNUP_SUCCESS);
      }
      catch (e) {
         if (e.name === 'ApiValidationError') {
            return res.status(400).json({ message: e.errors });
         }
         else {
            console.error('Error during sigin:\n', e);
            return res.status(500).json(e.message);
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