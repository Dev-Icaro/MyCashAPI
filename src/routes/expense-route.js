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

router.use("/api/expenses", validationErrorHandler);

module.exports = router;
