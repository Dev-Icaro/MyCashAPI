const userConstants = require("../constants/user-constants");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const User = require("../models").User;

/**
 * Represents a User Service.
 *
 * @class
 */
class UserService {
  /**
   * Get all users.
   *
   * @static
   * @async
   * @returns {Promise<Array>} An array of all users.
   */
  static async getAll() {
    return await User.findAll();
  }

  /**
   * Get user by ID.
   *
   * @static
   * @async
   * @param {number} userId - The ID of the user to retrieve.
   * @returns {Promise<User>} The user with the specified ID.
   */
  static async getById(userId) {
    return await User.findByPk(userId);
  }

  /**
   * Create a new user.
   *
   * @static
   * @async
   * @param {object} user - The user object to create.
   * @returns {Promise<User>} The newly created user.
   * @throws {Error} If there's an error creating the user.
   */
  static async create(user) {
    return await User.create(user).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }

  /**
   * Update user by ID.
   *
   * @static
   * @async
   * @param {object} updatedUser - The updated user object.
   * @param {number} userId - The ID of the user to update.
   * @returns {Promise<User>} The updated user.
   * @throws {Error} If there's an error updating the user.
   */
  static async updateById(updatedUser, userId) {
    return await User.update(updatedUser, {
      where: {
        id: Number(userId),
      },
    })
      .then(async () => {
        return await this.getById(userId);
      })
      .catch((err) => {
        SequelizeErrorWrapper.wrapError(err);
      });
  }

  /**
   * Delete user by ID.
   *
   * @static
   * @async
   * @param {number} userId - The ID of the user to delete.
   * @returns {Promise<number>} The number of deleted users (0 or 1).
   * @throws {Error} If there's an error deleting the user.
   */
  static async deleteById(userId) {
    return await User.destroy({ where: { id: Number(userId) } });
  }

  /**
   * Check if an user exists
   *
   * @param {number} userId  - The ID of the user to check if exists.
   * @returns {boolean}  Boolean indicating if exists or not.
   */
  static async exists(userId) {
    if (!this.getById(userId)) throw new Error(userConstants.MSG_NOT_FOUND);

    return true;
  }

  /**
   * Find a user by it's email.
   *
   * @static
   * @async
   * @param {string} userEmail - The user's email.
   * @returns {User} The user email owner.
   */
  static async findByEmail(userEmail) {
    return await User.findOne({
      where: {
        email: String(userEmail),
      },
    });
  }
}

module.exports = UserService;
