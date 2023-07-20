const ExpenseService = require("../services/expense-service");

class ExpenseController {
  static async getAll(req, res, next) {
    try {
      const expenseService = new ExpenseService(req.userId);
      const expenses = await expenseService.getAll();

      return res.status(200).json(expenses);
    } catch (err) {
      next(err);
    }
  }

  static async getById(req, res, next) {
    try {
      const { id } = req.params;
      const expenseService = new ExpenseService(req.userId);
      const expense = await expenseService.getById(id);

      return res.status(200).json(expense);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const expenseService = new ExpenseService(req.userId);
      const createdExpense = await expenseService.create(req.body);

      return res.status(200).json(createdExpense);
    } catch (err) {
      next(err);
    }
  }

  static async updateById(req, res, next) {
    try {
      const { id } = req.params;
      const expenseService = new ExpenseService(req.userId);
      const updatedExpense = await expenseService.updateById(id);

      return res.status(200).json(updatedExpense);
    } catch (err) {
      next(err);
    }
  }

  static async deleteById(req, res, next) {
    try {
      const { id } = req.params;
      const expenseService = new ExpenseService(req.userId);
      const updatedExpense = await expenseService.deleteById(id);

      return res.status(200).json(updatedExpense);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ExpenseController;
