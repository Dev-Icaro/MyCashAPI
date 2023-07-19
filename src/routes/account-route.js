const { Router } = require("express");
const authMiddleware = require("../middlewares/authentication-middleware");
const AccountController = require("../controllers/account-controller");
const { validateAccountId } = require("../validators/account-validator");
const validationResultHandler = require("../middlewares/validation-result-handler");
const { validationErrorHandler } = require("../middlewares/error-handlers");

const router = Router();

router.use("/api/account", authMiddleware);

router
  .route("/api/account")
  .get(AccountController.getAllAccounts)
  .post(AccountController.createAccount);

router
  .route("/api/account/:id")
  .all(validateAccountId(), validationResultHandler)
  .get(AccountController.getAccountById)
  .put(AccountController.updateAccountById)
  .delete(AccountController.deleteAccountById);

router.use("/api/account", validationErrorHandler);

module.exports = router;
