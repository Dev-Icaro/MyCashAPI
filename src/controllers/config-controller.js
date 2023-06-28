const ConfigService = require('../services/config-service');
const { SequelizeErrorWrapper } = require('../helpers/sequelize-error-wrapper');

class ConfigController {
   static async getEmailConfigById(req, res) {
      try {
         let serviceResponse = await ConfigService.getEmailConfigById(req.params.id);
         return res.status(serviceResponse.statusCode).json(serviceResponse);
      } 
      catch(e) {
         console.log(e.message);
         res.status(500).json(e.message);
      }
   }

  
}

module.exports = ConfigController;