const { Router } = require("express");
const authMiddleware = require("../middlewares/authentication-middleware");
const ExpenseController = require("../controllers/expense-controller");
const { validateExpenseIdParam } = require("../validators/expense-validator");
const validationResultHandler = require("../middlewares/validation-result-handler");
const { validationErrorHandler } = require("../middlewares/error-handlers");

const router = Router();

router.use("/api/expense", authMiddleware);

router
  .route("/api/expense")
  .get(ExpenseController.getAll)
  .post(ExpenseController.create);

router
  .route("/api/expense/:id")
  .all(validateExpenseIdParam, validationResultHandler)
  .get(ExpenseController.getById)
  .put(ExpenseController.updateById)
  .delete(ExpenseController.deleteById);

router.use("/api/expense", validationErrorHandler);

module.exports = router;
