const accountConsts = require("../constants/account-constants");
const ModelService = require("./model-service");

/**
 * Serviço de contas bancárias.
 */
class AccountService extends ModelService {
  async increaseAccountBalance(accountId, amount) {
    const account = await this.getById(accountId);
    if (!account) {
      throw new Error(accountConsts.MSG_NOT_FOUND);
    }

    return await account.addToBalance(amount);
  }
}

module.exports = AccountService;
