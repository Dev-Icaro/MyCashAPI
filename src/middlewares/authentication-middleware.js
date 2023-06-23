const AuthValidator = require('../validators/auth-validator');

function authenticateReq(req, res, next) {
   try {
      let authorization = req.headers.authorization;

      let validator = new AuthValidator();
      validator.validateAuthorization(authorization);

      if (!validator.isDataValid())
         return res.status(401).json({ statusCode: 401, message: validator.getErrors() });

      // success auth
      return next()
   } 
   catch(e) {
      console.log(e);
      return res.status(500).json(e.message);
   }
}  




module.exports = { authenticateReq }