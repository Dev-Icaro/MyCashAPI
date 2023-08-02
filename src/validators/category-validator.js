const { param } = require("express-validator");
const { validateIdParam } = require("./generic-validator");
const CategoryService = require("../services/category-service");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const categoryConsts = require("../constants/category-constants");

/**
 * Use express-validator to validate an category ID param in a request.
 * Obs: The validation result could be handled by the validationResultHandler.
 *
 * @returns {void}
 */
const validateCategoryIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    if (!(await CategoryService.getById(id, req.userId)))
      throw new ApiInvalidArgumentError(categoryConsts.MSG_NOT_FOUND);
  }),
];

/**
 * Function used to validate an category ID in Yup validation Schema
 * Obs: It could fail out of Yup schema scope.
 *
 * @param {number} categoryId - The category ID to be validate, Yup will assign this variable
 * if you pass it as an argument in the test method.
 * @returns {boolean} - Yup convention to indicate that its valid.
 * @throws {Error} - Yup convention to indicate that its fail.
 */
const yupCategoryExists = async function (categoryId) {
  return CategoryService.exists(categoryId, this.parent.userId);
};

module.exports = { validateCategoryIdParam, yupCategoryExists };
