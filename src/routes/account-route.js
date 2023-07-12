const { Router } = require("express");
const authMiddleware = require("../middlewares/authentication-middleware");
const AccountController = require("../controllers/account-controller");
const { validateAccountId } = require("../validators/account-validator");

const router = Router();

router.use("/api/account", authMiddleware);

router.get("/api/account", AccountController.getAllAccounts);

module.exports = router;
