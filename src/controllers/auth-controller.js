// Service
const AuthService = require("../services/auth-service");

// Cosntants
const authConsts = require("../constants/auth-constants");
const errorsConsts = require("../constants/error-constants");
const emailConsts = require("../constants/email-constants");

// Helpers / Utils
const logger = require("../utils/logger");

// Validators
const { validationResult } = require("express-validator");

/**
 * Controlador de Autenticação. Os métodos dos controladores
 * seguem o mesmo padrão, recebem a requisição, passam-a para a camada Service e ficam
 * responsáveis por lidar com possíveis exceções que ela possa lançar.
 */
class AuthController {
   /**
    * Recebe a requisição de signup, e passa os parâmetros para a camada Service.
    *
    * @param {Express.Request} req - Requisição contendo as informações do usuário a ser criado.
    * @param {Express.Response} res - Objeto de resposta.
    * @returns {Express.Response} - Retorna diferentes valores dependendo do fluxo da função.
    */
   static async signup(req, res) {
      try {
         let createdUser = await AuthService.signup(req.body);
         return res
            .status(200)
            .json({ message: authConsts.SIGNUP_SUCCESS, user: createdUser });
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
    * Recebe a requisição de sigin(login), verifica o resultado da validação do express validator e
    * passa os parâmetros para a camada Service.
    *
    * @param {Express.Request} req - Requisição contendo as credenciais do usuário a ser criado.
    * @param {Express.Response} res - Objeto de resposta.
    * @returns {Express.Response} - Retorna diferentes valores dependendo do fluxo da função.
    */
   static async signin(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({
               message: errorsConsts.MSG_VALIDATION_ERROR,
               errors: errors.array(),
            });
         }

         let authToken = await AuthService.signin(req.body);
         return res
            .status(200)
            .json({ message: authConsts.SIGNIN_SUCCESS, token: authToken });
      } catch (e) {
         if (e.name === "ApiUnauthorizedError") {
            return res
               .status(401)
               .json({ message: e.message, errors: e.errors });
         } else {
            logger.error("Error during sigin:\n", e);
            return res.status(500).json({ message: e.message });
         }
      }
   }

   /**
    * Recebe a requisição de recuperação de senha, verifica o resultado da validação do Express validator
    * e passa os parâmetros para a camada Service.
    *
    * @param {Express.Request} req - Requisição contendo as credenciais do usuário a ser criado.
    * @param {Express.Response} res - Objeto de resposta.
    * @returns {Express.Response} - Retorna diferentes valores dependendo do fluxo da função.
    */
   static async forgotPassword(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({
               message: errorsConsts.MSG_VALIDATION_ERROR,
               errors: errors.array(),
            });
         }

         await AuthService.forgotPassword(req.body.email);
         return res
            .status(200)
            .json({ message: emailConsts.EMAIL_RESET_TOKEN_SUCCESS });
      } catch (e) {
         switch (e.name) {
            case "ApiEmailConfigurationError": {
               return res
                  .status(400)
                  .json({ message: e.message, errors: e.errors });
            }
            default: {
               logger.error(e.message);
               return res.status(500).json({ message: e.message });
            }
         }
      }
   }

   /**
    * Recebe a requisição de resetPassword, verifica o resultado da validação do Express validator e passa
    * para a camada Service.
    *
    * @param {Express.Request} req Requisição contendo: {email, token, password}.
    * @param {Express.Response} res Objeto de resposta.
    * @returns {Express.Response} Retorna diferentes valores dependendo do fluxo da função.
    */
   static async resetPassword(req, res) {
      try {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            return res.status(400).json({
               message: errorsConsts.MSG_VALIDATION_ERROR,
               errors: errors.array(),
            });
         }

         await AuthService.resetPassword(req.body);
         return res.status(200).json({ message: authConsts.RESET_PASS_SUCESS });
      } catch (e) {
         if (e.name === "ApiUnauthorizedResetPassError") {
            return res
               .status(401)
               .json({ message: e.message, errors: e.errors });
         } else {
            logger.error(e.message);
            return res.status(500).json({ message: e.message });
         }
      }
   }
}

module.exports = AuthController;
