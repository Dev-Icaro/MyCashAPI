const Expense = require("../models").Expense;
const SequelizeErrorWrapper = require("../helpers/sequelize-error-wrapper");
const AccountService = require("./account-service");

class ExpenseService {
  constructor(userId) {
    this.userId = userId;
  }

  async getAllExpenses() {
    return await Expense.findAll({
      where: {
        user_id: Number(this.userId),
      },
    });
  }

  async getExpenseById(id) {
    return await Expense.findOne({
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    });
  }

  async createExpense(expense, accountId) {
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

  async updateExpenseById(expense, id) {
    return await Expense.update(expense, {
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    })
      .then(() => this.getExpenseById(id))
      .catch((err) => SequelizeErrorWrapper.wrapError(err));
  }

  async deleteExpenseById(id) {
    return await Expense.destroy({
      where: {
        id: Number(id),
        user_id: Number(this.userId),
      },
    });
  }
}

module.exports = ExpenseService;
