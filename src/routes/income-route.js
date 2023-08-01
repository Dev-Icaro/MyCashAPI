const { Router } = require("express");
const AuthMiddleware = require("../middlewares/authentication-middleware");

const router = Router();

router.use("/api/incomes", AuthMiddleware);

router.route("/api/incomes").get();

module.exports = router;
