const { Router } = require("express");
const authMiddleware = require("../middlewares/authentication-middleware");
const AccountController = require("../controllers/account-controller");
const { validateAccountId } = require("../validators/account-validator");
const validationHandler = require("../middlewares/validation-handler");
const { validationErrorHandler } = require("../middlewares/error-handlers");

const router = Router();

router.use("/api/account", authMiddleware);

router
  .route("/api/account")
  .get(AccountController.getAllAccounts)
  .post(AccountController.createAccount);

router
  .route("/api/account/:id")
  .all(validateAccountId(), validationHandler)
  .get(AccountController.getAccountById)
  .put(AccountController.updateAccountById)
  .delete(AccountController.deleteAccountById);

router.use("/api/account", validationErrorHandler);

module.exports = router;
