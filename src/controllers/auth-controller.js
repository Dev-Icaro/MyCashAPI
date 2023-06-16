const AuthService = require("../services/auth-service");

class AuthController {
   static async registerUser(req, res) {
      try {
         let serviceResponse = await AuthService.registerAccount(req.body);

         return res.status(serviceResponse.statusCode).json(serviceResponse);
      } 
      catch (e) {
         console.log(e.message);
         return res.status(500).json(e.message);
      };
   };

   static async login(req, res) {
      try {
         let serviceResponse = await AuthService.login(req.body);

         return res.status(serviceResponse.statusCode).json(serviceResponse);
      }
      catch(e) {
         console.log(e.message);
         return res.status(500).json(e.message);
      }
   }
};

module.exports = AuthController;