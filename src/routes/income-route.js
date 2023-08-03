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

router
  .route("/api/incomes/:id")
  .get(IncomeController.getById)
  .put(IncomeController.updateById)
  .delete(IncomeController.deleteById);

router.get("/api/incomes/account/:accountId", IncomeController.getByAccountId);

router.get(
  "/api/incomes/category/:categoryId",
  IncomeController.getByCategoryId,
);

router.get(
  "/api/incomes/account/:accountId/category/:categoryId",
  IncomeController.getByAccountIdAndCategoryId,
);

router.use("/api/incomes", validationErrorHandler);

module.exports = router;
