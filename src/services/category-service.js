const Category = require("../models").Category;
const ModelService = require("./model-service");

class CategoryService extends ModelService {
  constructor(userId) {
    super(userId, Category);
  }
}

module.exports = CategoryService;
