const { Router } = require("express");
const authMiddleware = require("../middlewares/authentication-middleware");
const ExpenseController = require("../controllers/expense-controller");
const { validationErrorHandler } = require("../middlewares/error-handlers");

const router = Router();

router.use("/api/expenses", authMiddleware);

router
  .route("/api/expenses")
  .get(ExpenseController.getAll)
  .post(ExpenseController.create);

router
  .route("/api/expenses/:id")
  .get(ExpenseController.getById)
  .put(ExpenseController.updateById)
  .delete(ExpenseController.deleteById);

router.get(
  "/api/expenses/account/:accountId",
  ExpenseController.getByAccountId,
);

router.get(
  "/api/expenses/category/:categoryId",
  ExpenseController.getByCategoryId,
);

router.get(
  "/api/expenses/account/:accountId/category/:categoryId",
  ExpenseController.getByAccountIdAndCategoryId,
);

router.use("/api/expenses", validationErrorHandler);

module.exports = router;
