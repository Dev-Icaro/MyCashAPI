const Expense = require("../models").Expense;
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const ModelService = require("./model-service");

class ExpenseService extends ModelService {
  constructor(userId) {
    super(userId, Expense);
  }

  async create(expense) {
    expense.user_id = this.userId;

    // const accountService = new AccountService(this.userId);
    // await accountService.increaseAccountBalance(
    //   expense.account_id,
    //   expense.amount,
    // );

    return await Expense.create(expense).catch((err) =>
      SequelizeErrorWrapper.wrapError(err),
    );
  }
}

module.exports = ExpenseService;
