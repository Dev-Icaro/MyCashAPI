const accountConsts = require("../constants/account-constants");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Account = require("../models").Account;
const { validateUserId } = require("../validators/user-validator");

/**
 * Bank account service.
 */
class AccountService {
  /**
   * Gets all bank accounts associated with a specific user.
   *
   * @param {number} userId - The ID of the user who owns the accounts.
   * @returns {Promise<Array>} A promise that resolves to a list of bank accounts.
   */
  static async getAll(userId) {
    await validateUserId(userId);

    return await Account.findAll({
      where: {
        userId: Number(userId),
      },
    });
  }

  /**
   * Gets the details of a specific bank account based on the account ID and the owner's user ID.
   *
   * @param {number} id - The ID of the bank account to be retrieved.
   * @param {number} userId - The ID of the user who owns the account.
   * @returns {Promise<Object>} A promise that resolves to the details of the found bank account.
   */
  static async getById(id, userId, dbTransaction) {
    await validateUserId(userId);

    return await Account.findOne(
      {
        where: {
          id: Number(id),
          userId: Number(userId),
        },
      },
      { transaction: dbTransaction },
    );
  }

  /**
   * Creates a new bank account associated with a user.
   *
   * @param {Object} account - An object containing the information of the new bank account.
   * @param {number} userId - The ID of the user who owns the new account.
   * @returns {Promise<Object>} A promise that resolves to the details of the newly created account.
   */
  static async create(account, userId) {
    await validateUserId(userId);

    return await Account.create({ ...account, userId: userId }).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }

  /**
   * Updates the details of an existing bank account based on the account ID and the owner's user ID.
   *
   * @param {Object} account - An object containing the updated information of the bank account.
   * @param {number} id - The ID of the bank account to be updated.
   * @param {number} userId - The ID of the user who owns the account.
   * @returns {Promise<Object>} A promise that resolves to the updated details of the bank account.
   */
  static async updateById(account, id, userId) {
    await validateUserId(userId);

    return await Account.update(account, {
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    })
      .then(async () => await this.getById(id, userId))
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Deletes an existing bank account based on the account ID and the owner's user ID.
   *
   * @param {number} id - The ID of the bank account to be deleted.
   * @param {number} userId - The ID of the user who owns the account.
   * @returns {Promise<boolean>} A promise that resolves to true if the account was successfully deleted.
   */
  static async deleteById(id, userId) {
    await validateUserId(userId);

    return await Account.destroy({
      where: {
        id: Number(id),
        userId: Number(userId),
      },
    }).catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  /**
   * Check if the user account exists.
   *
   * @param {number} accountId - The ID of the account to check if exists.
   * @param {number} userId - The id of the user account owner.
   * @returns {boolean} - A boolean indicating if the account exists.
   */
  static async exists(accountId, userId) {
    if (!(await this.getById(accountId, userId))) {
      throw new Error(accountConsts.MSG_NOT_FOUND);
    }

    return true;
  }

  /**
   * Increases the balance of a specific bank account.
   *
   * @param {number} accountId - The ID of the bank account whose balance will be increased.
   * @param {number} amount - The value to be added to the current balance of the account.
   * @param {number} userId - The ID of the user who owns the account.
   * @returns {Promise<number>} A promise that resolves to the new current balance of the account.
   * @throws {Error} Throws an error if the account is not found.
   */
  static async deposit(accountId, amount, userId) {
    await validateUserId(userId);

    const account = await this.getById(accountId, userId);
    if (!account) {
      throw new Error(accountConsts.MSG_NOT_FOUND);
    }

    account.balance += amount;

    return await account.save();
  }

  /**
   * Decrease the balance of a specific bank account
   *
   * @param {number} accountId - The ID of the bank account whose balance will be decreased.
   * @param {number} amount - The value to be withdral to the current balance of the account.
   * @param {number} userId - The ID of the user who owns the account.
   * @returns {Promise<number>} A promise that resolves to the new current balance of the account.
   * @throws {Error} Throws an error if the account is not found.
   */
  static async withdrawl(accountId, amount, userId, dbTransaction) {
    await validateUserId(userId);

    const account = await this.getById(accountId, userId, dbTransaction);
    if (!account) {
      throw new Error(accountConsts.MSG_NOT_FOUND);
    }

    account.balance -= amount;

    await account.save();
  }
}

module.exports = AccountService;
