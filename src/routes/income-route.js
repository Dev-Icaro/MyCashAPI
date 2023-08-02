const { Router } = require("express");
const AuthMiddleware = require("../middlewares/authentication-middleware");
const IncomeController = require("../controllers/income-controller");
const { validationErrorHandler } = require("../middlewares/error-handlers");

const router = Router();

router.use("/api/incomes", AuthMiddleware);

router
  .route("/api/incomes")
  .get(IncomeController.getAll)
  .post(IncomeController.create);

router.use("/api/incomes", validationErrorHandler);

module.exports = router;
