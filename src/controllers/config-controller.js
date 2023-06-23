const ConfigService = require('../services/config-service');

class ConfigController {
   static async getEmailConfig(req, res) {
      try {
         let serviceResponse = await ConfigService.getEmailConfigById(req.params.id);
         return res.status(serviceResponse.statusCode).json(serviceResponse);
      } 
      catch(e) {
         console.log(e.message);
         res.status(500).json(e.message);
      }
   }

   static async createEmailConfig(req, res) {
      try {
         let serviceResponse = await ConfigService.createEmailConfig(req.body);
         return res.status(serviceResponse.statusCode).json(serviceResponse);
      }
      catch(e) {
         console.log(e.message);
         res.status(500).json(e.message);
      }
   }
}

module.exports = ConfigController;