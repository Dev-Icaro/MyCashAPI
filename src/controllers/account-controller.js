const AccountService = require("../services/account-service");
const logger = require("../utils/logger");
const accountConsts = require("../constants/account-constants");

class AccountController {
   static async getAllAccounts(req, res) {
      try {
         const accounts = await AccountService.getAllAccounts();
         return res.status(200).json(accounts);
      } catch (e) {
         logger.error(accountConsts.ACCOUNT_FAIL, e);
         res.status(500).json({ message: e.message });
      }
   }

   static async getAccountById(req, res) {
      try {
         const { id } = req.params;
         const account = await AccountService.getAccountById(id);
         return res.status(200).json(account);
      } catch (e) {}
   }
}

module.exports = AccountController;
