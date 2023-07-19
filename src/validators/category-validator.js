const { param } = require("express-validator");
const { validateIdParam } = require("./generic-validator");
const CategoryService = require("../services/category-service");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const categoryConsts = require("../constants/category-constants");

const validateCategoryIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    const categoryService = new CategoryService(req.userId);
    if (!(await categoryService.getById(id)))
      throw new ApiInvalidArgumentError(categoryConsts.MSG_NOT_FOUND);
  }),
];

module.exports = { validateCategoryIdParam };
