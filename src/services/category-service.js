const Category = require("../models").Category;
const categoryConstants = require("../constants/category-constants");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");

/**
 * Class responsible for providing services related to categories.
 */
class CategoryService {
  /**
   * Retrieves all categories for the authenticated user.
   *
   * @param {number} userId - The ID of the user to filter categories.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's categories.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getAll(userId) {
    return await Category.findAll({
      where: {
        userId: Number(userId),
      },
    });
  }

  /**
   * Retrieves a specific category based on the ID and the ID of the authenticated user.
   *
   * @param {number} id - The category ID.
   * @param {number} userId - The ID of the user who owns the category.
   * @returns {Promise<Object>} A Promise that resolves to the found category object.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async getById(id, userId) {
    return await Category.findOne({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
  }

  /**
   * Creates a new category for the authenticated user.
   *
   * @param {Object} category - The category object to be created.
   * @returns {Promise<Object>} A Promise that resolves to the created category object.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async create(category, userId) {
    return await Category.create({ ...category, userId: userId }).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }

  /**
   * Updates an existing category based on the ID and the ID of the authenticated user.
   *
   * @param {Object} category - The category object to be updated.
   * @param {number} id - The ID of the category to be updated.
   * @param {number} userId - The ID of the user who owns the category.
   * @returns {Promise<Object>} A Promise that resolves to the updated category object.
   * @throws {Error} If an error occurs during the method execution.
   */
  static async updateById(category, id, userId) {
    return await Category.update(category, {
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    })
      .then(async () => {
        return await this.getById(id, userId);
      })
      .catch((err) => {
        SequelizeErrorWrapper.wrapError(err);
      });
  }

  /**
   * Deletes an existing category based on the ID and the ID of the authenticated user.
   *
   * @param {number} id - The ID of the category to be deleted.
   * @param {number} userId - The ID of the user who owns the category.
   * @returns {Promise<number>} A Promise that resolves with the number of deleted rows (0 or 1).
   * @throws {Error} If an error occurs during the method execution.
   */
  static async deleteById(id, userId) {
    return await Category.destroy({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    });
  }

  /**
   * Checks if a user category exists.
   *
   * @param {number} categoryId - The category ID to check if it exists.
   * @param {number} userId - The user ID related to the category.
   * @returns {boolean} - A boolean indicating whether the category exists or not.
   * @throws {Error} - Error indicating that the user wasn't found.
   */
  static async exists(categoryId, userId) {
    if (!(await this.getById(categoryId, userId)))
      throw new Error(categoryConstants.MSG_NOT_FOUND);

    return true;
  }
}

module.exports = CategoryService;
