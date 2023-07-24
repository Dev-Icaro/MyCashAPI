const { Router } = require("express");
const authMiddleware = require("../middlewares/authentication-middleware");
const ExpenseController = require("../controllers/expense-controller");
const { validateExpenseIdParam } = require("../validators/expense-validator");
const validationResultHandler = require("../middlewares/validation-result-handler");
const { validationErrorHandler } = require("../middlewares/error-handlers");
const { validateTransaction } = require("../validators/transaction-validator");

const router = Router();

router.use("/api/expenses", authMiddleware);

router
  .route("/api/expenses")
  .get(ExpenseController.getAll)
  .post(ExpenseController.create);

router
  .route("/api/expenses/:id")
  .all(validateExpenseIdParam(), validationResultHandler)
  .get(ExpenseController.getById)
  .put(ExpenseController.updateById)
  .delete(ExpenseController.deleteById);

router.post("/api/testSchema", (req, res, next) => {
  validateTransaction(req.body, {}, (err) => {
    if (err) {
      const errors = validationResult(err);
      console.log(errors.array());
    }
  });
});

router.use("/api/expenses", validationErrorHandler);

module.exports = router;
