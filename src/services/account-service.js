const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const models = require("../models");
const Account = models.Account;

class AccountService {
   static async getAllAccounts() {
      return await Account.findAll();
   }

   static async getAccountById(id) {
      return await Account.getAccountById(id);
   }

   static async createAccount(account) {
      return await Account.create(account)
         .then((createdAccount) => {
            return createdAccount;
         })
         .catch((err) => SequelizeErrorWrapper.wrapError(err));
   }

   static async updateAccountById(updatedAccount, id) {
      return await Account.update(updatedAccount, {
         where: {
            id: Number(id),
         },
      })
         .then(async () => {
            return await Account.getAccountById(id);
         })
         .catch((err) => {
            SequelizeErrorWrapper.wrapError(err);
         });
   }

   static async deleteAccountById(id) {
      await Account.destroy({
         where: {
            id: Number(id),
         },
      });
   }
}

module.exports = AccountService;
