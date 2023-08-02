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

  static async getById(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const income = await IncomeService.getById(id, userId);

      return res.status(200).json(income);
    } catch (err) {
      next(err);
    }
  }

  static async getByAccountId(req, res, next) {
    try {
      const { accountId } = req.params;
      const { userId } = req;

      const income = await IncomeService.getByAccountId(accountId, userId);

      return res.status(200).json(income);
    } catch (err) {
      next(err);
    }
  }

  static async getByCategoryId(req, res, next) {
    try {
      const { categoryId } = req.params;
      const { userId } = req;

      const income = await IncomeService.getByCategoryId(categoryId, userId);

      return res.status(200).json(income);
    } catch (err) {
      next(err);
    }
  }

  static async getByAccountIdAndCategoryId(req, res, next) {
    try {
      const { accountId, categoryId } = req.params;
      const { userId } = req;

      const incomes = await IncomeService.getByAccountIdAndCategoryId(
        accountId,
        categoryId,
        userId,
      );

      return res.status(200).json(incomes);
    } catch (err) {
      next(err);
    }
  }

  static async updateById(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;

      const updatedIncome = await IncomeService.updateById(
        req.body,
        id,
        userId,
      );

      return res.status(200).json(updatedIncome);
    } catch (err) {
      next(err);
    }
  }

  static async deleteById(req, res, next) {
    try {
      const { userId } = req;
      const { id } = req.params;

      await IncomeService.deleteById(id, userId);

      return res.status(200).json({ message: "Income deleted with success" });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = IncomeController;
