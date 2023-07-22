const { Router } = require("express");
const CategoryController = require("../controllers/category-controller");
const { validateCategoryIdParam } = require("../validators/category-validator");
const validationResultHandler = require("../middlewares/validation-result-handler");
const { validationErrorHandler } = require("../middlewares/error-handlers");
const authMiddleware = require("../middlewares/authentication-middleware");

const router = Router();

router.use(authMiddleware);

router
  .route("/api/category")
  .get(CategoryController.getAll)
  .post(CategoryController.create);

router
  .route("/api/category/:id")
  .all(validateCategoryIdParam(), validationResultHandler)
  .get(CategoryController.getById)
  .put(CategoryController.updateById)
  .delete(CategoryController.deleteById);

router.use(validationErrorHandler);

module.exports = router;
