const EmailConfigService = require("../services/email-config-service");
const emailConfigConsts = require("../constants/email-config-constants");

/**
 * Controlador EmailConfig.
 * Todos os métodos dessa classe seguem o mesmo padrão, pegam a requisição já validada e passam
 * para a camada service.
 */
class EmailConfigController {
  /**
   * Pega todas as configurações de email do usuário.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {EmailConfig}
   */
  static async getAllEmailConfigs(req, res, next) {
    try {
      const emailConfigService = new EmailConfigService(req.userId);
      let emailConfigs = await emailConfigService.getAllEmailConfigs();

      return res.status(200).json(emailConfigs);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Pega o registro pelo Id.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {EmaiLConfig}
   */
  static async getEmailConfigById(req, res, next) {
    try {
      const { id } = req.params;
      const emailConfigService = new EmailConfigService(req.userId);
      let emailConfig = await emailConfigService.getEmailConfigById(id);

      res.status(200).json(emailConfig);
    } catch (e) {
      next(e);
    }
  }

  /**
   * Cria uma configuração de email.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response} - Mensagem de sucesso ou mensagem contendo erro.
   */
  static async createEmailConfig(req, res, next) {
    try {
      const emailConfigService = new EmailConfigService(req.userId);
      let createdEmailConfig = await emailConfigService.createEmailConfig(
        req.body
      );

      return res.status(200).json({
        message: emailConfigConsts.EMAIL_CONFIG_SUCCESS,
        emailConfig: createdEmailConfig,
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Deleta pelo Id.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response} - Mensagem de sucesso ou mensagem contendo erro.
   */
  static async deleteEmailConfigById(req, res, next) {
    try {
      const { id } = req.params;
      const emailConfigService = new EmailConfigService(req.userId);
      await emailConfigService.deleteEmailConfigById(id);

      return res.status(200).json({
        message: emailConfigConsts.EMAIL_CONFIG_DELETED.replace(
          "{placeholder}",
          id
        ),
      });
    } catch (e) {
      next(e);
    }
  }

  /**
   * Atualiza pelo Id.
   *
   * @param {Express.Request} req
   * @param {Express.Response} res
   * @returns {Express.Response} - Resposta da requisição.
   */
  static async updateEmailConfigById(req, res, next) {
    try {
      const { id } = req.params;
      const emailConfigService = new EmailConfigService(req.userId);
      let updatedEmailConfig = await emailConfigService.updateEmailConfigById(
        req.body,
        id
      );

      return res.status(200).json({
        message: emailConfigConsts.EMAIL_CONFIG_UPDATED,
        emailConfig: updatedEmailConfig,
      });
    } catch (e) {
      next(e);
    }
  }
}

module.exports = EmailConfigController;
