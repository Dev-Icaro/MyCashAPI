const Category = require("../models").Category;
const ModelService = require("./model-service");

class CategoryService extends ModelService {
  constructor(userId) {
    super(userId, Category);
  }

  async isUserCategory(idCategory) {
    return (await this.getById(idCategory)) ? true : false;
  }
}

module.exports = CategoryService;
