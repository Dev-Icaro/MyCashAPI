const ExpenseService = require("../services/expense-service");

class ExpenseController {
  static async getAllExpenses(req, res, next) {
    try {
      const expenseService = new ExpenseService(req.userId);
      const expenses = await expenseService.getAllExpenses();

      return res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  }

  static async getExpenseById(req, res, next) {
    try {
      const { id } = req.params;
      const expenseService = new ExpenseService(req.userId);
      const expense = await expenseService.getExpenseById(id);

      return res.status(200).json(expense);
    } catch (err) {
      next(err);
    }
  }

  static async createExpense(req, res, next) {
    try {
      const expenseService = new ExpenseService(req.userId);
      const createdExpense = await expenseService.createExpense(req.body);

      return res.status(200).json(createdExpense);
    } catch (err) {
      next(err);
    }
  }

  static async updateExpenseById(req, res, next) {
    try {
      const { id } = req.params;
      const expenseService = new ExpenseService(req.userId);
      const updatedExpense = await expenseService.updateExpenseById(id);

      return res.status(200).json(updatedExpense);
    } catch (err) {
      next(err);
    }
  }

  static async deleteExpenseById(req, res, next) {
    try {
      const { id } = req.params;
      const expenseService = new ExpenseService(req.userId);
      const updatedExpense = await expenseService.deleteExpenseById(id);

      return res.status(200).json(updatedExpense);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExpenseController;
