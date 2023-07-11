// Services
const EmailConfigService = require("../services/email-config-service");

// Constants
const emailConfigConsts = require("../constants/email-config-constants");
const errorsConsts = require("../constants/error-constants");

// Helpers / Utils
const logger = require("../utils/logger");

// Validators
const { validationResult } = require("express-validator");

/**
 * Controlador EmailConfig, segue o padrão dos controladores da Api,
 * Verificando o resultado das validações do express validator, e passando os
 * parâmetros para a camada Service.
 */
class EmailConfigController {
   /**
    * Pega todos os registros da tabela.
    *
    * @param {Express.Request} req
    * @param {Express.Response} res
    * @returns {EmailConfig}
    */
   static async getAllEmailConfigs(req, res) {
      try {
         let emailConfigs = await EmailConfigService.getAllEmailConfigs();
         res.status(200).json(emailConfigs);
      } catch (e) {
         logger.error(emailConfigConsts.EMAIL_CONFIG_FAIL, e);
         res.status(500).json({ message: e.message });
      }
   }

   /**
    * Pega o registro pelo Id.
    *
    * @param {Express.Request} req
    * @param {Express.Response} res
    * @returns {EmaiLConfig}
    */
   static async getEmailConfigById(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({
               message: errorsConsts.MSG_VALIDATION_ERROR,
               errors: errors.array(),
            });
         }

         const { id } = req.params;
         let emailConfig = await EmailConfigService.getEmailConfigById(id);
         res.status(200).json(emailConfig);
      } catch (e) {
         logger.error(emailConfigConsts.EMAIL_CONFIG_FAIL, e);
         res.status(500).json({ message: e.message });
      }
   }

   /**
    * Cria uma configuração de email.
    *
    * @param {Express.Request} req
    * @param {Express.Response} res
    * @returns {Express.Response} - Mensagem de sucesso ou mensagem contendo erro.
    */
   static async createEmailConfig(req, res) {
      try {
         let createdEmailConfig = await EmailConfigService.createEmailConfig(
            req.body
         );
         return res.status(200).json({
            message: emailConfigConsts.EMAIL_CONFIG_SUCCESS,
            emailConfig: createdEmailConfig,
         });
      } catch (e) {
         switch (e.name) {
            case "ApiValidationError": {
               return res
                  .status(400)
                  .json({ message: e.message, errors: e.errors });
            }
            case "ApiUniqueConstraintError": {
               return res
                  .status(409)
                  .json({ message: e.message, errors: e.errors });
            }
            default: {
               logger.error("Error during sigup:\n", e);
               return res.status(500).json({ message: e.message });
            }
         }
      }
   }

   /**
    * Deleta pelo Id.
    *
    * @param {Express.Request} req
    * @param {Express.Response} res
    * @returns {Express.Response} - Mensagem de sucesso ou mensagem contendo erro.
    */
   static async deleteEmailConfigById(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({
               message: errorsConsts.MSG_VALIDATION_ERROR,
               errors: errors.array(),
            });
         }

         const { id } = req.params;
         await EmailConfigService.deleteEmailConfigById(id);
         res.status(200).json({
            message: emailConfigConsts.EMAIL_CONFIG_DELETED.replace(
               "{placeholder}",
               id
            ),
         });
      } catch (e) {
         logger.error(emailConfigConsts.EMAIL_CONFIG_FAIL, e);
         return res.status(500).json({ message: e.message });
      }
   }

   /**
    * Atualiza pelo Id.
    *
    * @param {Express.Request} req
    * @param {Express.Response} res
    * @returns {Express.Response} - Resposta da requisição.
    */
   static async updateEmailConfigById(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({
               message: errorsConsts.MSG_VALIDATION_ERROR,
               errors: errors.array(),
            });
         }

         const { id } = req.params;
         let updatedEmailConfig =
            await EmailConfigService.updateEmailConfigById(req.body, id);
         return res.status(200).json({
            message: emailConfigConsts.EMAIL_CONFIG_UPDATED,
            emailConfig: updatedEmailConfig,
         });
      } catch (e) {
         switch (e.name) {
            case "ApiValidationError": {
               return res
                  .status(400)
                  .json({ message: e.message, errors: e.errors });
            }
            case "ApiUniqueConstraintError": {
               return res
                  .status(409)
                  .json({ message: e.message, errors: e.errors });
            }
            default: {
               logger.error(emailConfigConsts.EMAIL_CONFIG_FAIL, e);
               return res.status(500).json({ message: e.message });
            }
         }
      }
   }
}

module.exports = EmailConfigController;
