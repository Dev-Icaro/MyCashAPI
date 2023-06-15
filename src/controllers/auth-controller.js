const AuthService = require("../services/auth-service");

class AuthController {
   static async registerUser(req, res) {
      try {
         let serviceResponse = await AuthService.registerAccount(req.body);

         return res.status(serviceResponse.statusCode).json(serviceResponse);
      } 
      catch (error) {
         console.log(error.message);
         return res.status(500).json(error.message);
      };
   };
};

module.exports = AuthController;