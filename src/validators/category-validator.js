const { param } = require("express-validator");
const { validateIdParam } = require("./generic-validator");
const CategoryService = require("../services/category-service");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const categoryConsts = require("../constants/category-constants");

const validateCategoryIdParam = () => [
  validateIdParam(),
  param("id").custom(async (id, { req }) => {
    if (!(await CategoryService.getById(id, req.userId)))
      throw new ApiInvalidArgumentError(categoryConsts.MSG_NOT_FOUND);
  }),
];

module.exports = { validateCategoryIdParam };
