const EmailConfigController = require("../controllers/email-config-controller");
const authenticationMiddleware = require("../middlewares/authentication-middleware");
const {
  validateEmailConfigParam,
} = require("../validators/email-config-validator");
const validationHandler = require("../middlewares/validation-handler");
const { validationErrorHandler } = require("../middlewares/error-handlers");
const { Router } = require("express");

const router = Router();

router.use("/api/config", authenticationMiddleware);

router
  .route("/api/config/email")
  .get(EmailConfigController.getAllEmailConfigs)
  .post(EmailConfigController.createEmailConfig, validationErrorHandler);

router
  .route("/api/config/email/:id")
  .all(validateEmailConfigParam(), validationHandler)
  .get(EmailConfigController.getEmailConfigById)
  .delete(EmailConfigController.deleteEmailConfigById)
  .put(EmailConfigController.updateEmailConfigById);

module.exports = router;
