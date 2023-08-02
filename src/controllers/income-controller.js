const IncomeService = require("../services/income-service");

class IncomeController {
  static async getAll(req, res, next) {
    try {
      const { userId } = req;
      const incomes = await IncomeService.getAll(userId);

      return res.status(200).json(incomes);
    } catch (err) {
      next(err);
    }
  }

  static async create(req, res, next) {
    try {
      const { userId } = req;
      const createdIncome = await IncomeService.create(req.body, userId);

      res.status(200).json(createdIncome);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = IncomeController;
