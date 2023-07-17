const AuthService = require("../services/auth-service");
const authConsts = require("../constants/auth-constants");
const emailConsts = require("../constants/email-constants");

/**
 * Controlador de Autenticação.
 * Todos os métodos dessa classe seguem o mesmo padrão, pegam a requisição já validada e passam
 * para a camada service.
 */
class AuthController {
   /**
    * @param {Express.Request} req - Requisição contendo as informações do usuário a ser criado.
    * @param {Express.Response} res - Objeto de resposta.
    * @returns {Express.Response} - Retorna diferentes valores dependendo do fluxo da função.
    */
   static async signup(req, res, next) {
      try {
         let createdUser = await AuthService.signup(req.body);
         return res
            .status(200)
            .json({ message: authConsts.SIGNUP_SUCCESS, user: createdUser });
      } catch (e) {
         next(e);
      }
   }

   /**
    * @param {Express.Request} req - Requisição contendo as credenciais do usuário a ser criado.
    * @param {Express.Response} res - Objeto de resposta.
    * @returns {Express.Response} - Retorna diferentes valores dependendo do fluxo da função.
    */
   static async signin(req, res, next) {
      try {
         let authToken = await AuthService.signin(req.body);
         return res
            .status(200)
            .json({ message: authConsts.SIGNIN_SUCCESS, token: authToken });
      } catch (e) {
         next(e);
      }
   }

   /**
    * @param {Express.Request} req - Requisição contendo as credenciais do usuário a ser criado.
    * @param {Express.Response} res - Objeto de resposta.
    * @returns {Express.Response} - Retorna diferentes valores dependendo do fluxo da função.
    */
   static async forgotPassword(req, res, next) {
      try {
         await AuthService.forgotPassword(req.body.email);
         return res
            .status(200)
            .json({ message: emailConsts.EMAIL_RESET_TOKEN_SUCCESS });
      } catch (e) {
         next(e);
      }
   }

   /**
    * @param {Express.Request} req Requisição contendo: {email, token, password}.
    * @param {Express.Response} res Objeto de resposta.
    * @returns {Express.Response} Retorna diferentes valores dependendo do fluxo da função.
    */
   static async resetPassword(req, res, next) {
      try {
         await AuthService.resetPassword(req.body);
         return res.status(200).json({ message: authConsts.RESET_PASS_SUCESS });
      } catch (e) {
         next(e);
      }
   }
}

module.exports = AuthController;
