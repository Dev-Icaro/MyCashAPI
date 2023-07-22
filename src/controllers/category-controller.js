const CategoryService = require("../services/category-service");
const categoryConsts = require("../constants/category-constants");

/**
 * Controller handling HTTP requests related to categories in the application.
 */
class CategoryController {
  /**
   * Get all categories for the authenticated user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Next middleware function.
   * @returns {object} - JSON object containing the categories data.
   */
  static async getAll(req, res, next) {
    try {
      const categories = await CategoryService.getAll(req.userId);

      return res.status(200).json(categories);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Get a specific category by its ID for the authenticated user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Next middleware function.
   * @returns {object} - JSON object containing the category data.
   */
  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const category = await CategoryService.getById(id, req.userId);

      return res.status(200).json(category);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Create a new category for the authenticated user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Next middleware function.
   * @returns {object} - JSON object containing the created category data.
   */
  static async create(req, res, next) {
    try {
      const createdCategory = await CategoryService.create(
        req.body,
        req.userId,
      );

      return res.status(200).json(createdCategory);
    } catch (err) {
      next(err);
    }
  }

  /**
   * Delete a category by its ID for the authenticated user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Next middleware function.
   * @returns {object} - JSON object with a success message.
   */
  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      await CategoryService.deleteById(id, req.userId);

      return res.status(200).json({ message: categoryConsts.MSG_DELETED });
    } catch (err) {
      next(err);
    }
  }

  /**
   * Update a category by its ID for the authenticated user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {function} next - Next middleware function.
   * @returns {object} - JSON object containing the updated category data.
   */
  static async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const updatedCategory = await CategoryService.updateById(
        req.body,
        id,
        req.userId,
      );

      return res.status(200).json(updatedCategory);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = CategoryController;
