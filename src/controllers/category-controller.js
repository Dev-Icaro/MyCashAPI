const CategoryService = require("../services/category-service");
const categoryConsts = require("../constants/category-constants");

class CategoryController {
  static async getAll(req, res, next) {
    try {
      const categoryService = new CategoryService(req.userId);
      const categories = await categoryService.getAll();

      return res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const categoryService = new CategoryService(req.userId);
      const category = await categoryService.getById(id);

      return res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const categoryService = new CategoryService(req.userId);
      const createdCategory = await categoryService.create(req.body);

      return res.status(200).json(createdCategory);
    } catch (err) {
      next(err);
    }
  }

  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const categoryService = new CategoryService(req.userId);
      await categoryService.deleteById(id);

      return res.status(200).json({ message: categoryConsts.MSG_DELETED });
    } catch (err) {
      next(err);
    }
  }

  static async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const categoryService = new CategoryService(req.userId);
      const updatedCategory = await categoryService.updateById(req.body, id);

      return res.status(200).json(updatedCategory);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
