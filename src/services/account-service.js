const accountConsts = require("../constants/account-constants");
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const Account = require("../models").Account;
const { validateUserId } = require("../validators/auth-validator");

/**
 * Serviço de contas bancárias.
 */
class AccountService {
  static async getAll(userId) {
    await validateUserId(userId);

    return await Account.findAll({
      where: {
        user_id: Number(userId),
      },
    });
  }

  static async getById(id, userId) {
    await validateUserId(userId);

    return await Account.findOne({
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    });
  }

  static async create(account, userId) {
    await validateUserId(userId);

    return await Account.create({ ...account, user_id: userId }).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }

  static async updateById(account, id, userId) {
    await validateUserId(userId);

    return await Account.update(account, {
      where: {
        id: Number(id),
        user_id: Number(userId),
      },
    })
      .then(async () => await this.getById(id, userId))
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  static async increaseAccountBalance(accountId, amount, userId) {
    await validateUserId(userId);

    const account = await this.getById(accountId);
    if (!account) {
      throw new Error(accountConsts.MSG_NOT_FOUND);
    }

    return await account.addToBalance(amount);
  }
}

module.exports = AccountService;
