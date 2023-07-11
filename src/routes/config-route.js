const EmailConfigController = require("../controllers/email-config-controller");
const authenticationMiddleware = require("../middlewares/authentication-middleware");
const {
   validateEmailConfigParam,
} = require("../validators/email-config-validator");
const { Router } = require("express");

const router = Router();

router.use("/api/config", authenticationMiddleware);

router
   .route("/api/config/email")
   .get(EmailConfigController.getAllEmailConfigs)
   .post(EmailConfigController.createEmailConfig);

router
   .route("/api/config/email/:id")
   .all(validateEmailConfigParam())
   .get(EmailConfigController.getEmailConfigById)
   .delete(EmailConfigController.deleteEmailConfigById)
   .put(EmailConfigController.updateEmailConfigById);

module.exports = router;
