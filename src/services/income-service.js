const errorConstants = require("../constants/error-constants");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const {
  ApiValidationError,
  ApiNotFoundError,
} = require("../errors/validation-errors");
const ErrorMessageFormatter = require("../utils/error-message-formatter");
const Income = require("../models").Income;
const { incomeSchema } = require("../validators/income-validator");
const {
  createTransactionFromIncome,
  handleIncomeIsPaidChange,
} = require("../helpers/income-helpers");
const TransactionTypesEnum = require("../enums/transaction-types-enum");
const { validatePresentProps } = require("../validators/generic-validator");
const { handleAccountBalanceError } = require("../helpers/income-helpers");

/**
 * Class responsible for providing income-related services.
 */
class IncomeService {
  /**
   * Get all incomes of a specific user.
   *
   * @param {number} userId - The ID of the user to filter incomes.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's incomes.
   */
  static async getAll(userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    return await Income.findAll({
      where: {
        userId: Number(userId),
      },
    });
  }

  /**
   * Get a specific income based on the ID and user ID.
   *
   * @param {number} id - The ID of the income.
   * @param {number} userId - The ID of the user who owns the income.
   * @returns {Promise<Object>} A Promise that resolves to the found income object.
   */
  static async getById(id, userId) {
    if (!id) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("id"),
      );
    }

    if (!userId) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );
    }

    return await Income.findOne({
      where: {
        userId: Number(userId),
        id: Number(id),
      },
    });
  }

  /**
   * Get incomes by account ID.
   *
   * @param {number} accountId - The ID of the account to filter incomes.
   * @param {number} userId - The ID of the user who owns the incomes.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's incomes for the specified account.
   */
  static async getByAccountId(accountId, userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    if (!accountId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("accountId"),
      );

    return await Income.findAll({
      where: {
        accountId: Number(accountId),
        userId: Number(userId),
      },
    });
  }

  /**
   * Get incomes by category ID.
   *
   * @param {number} categoryId - The ID of the category to filter incomes.
   * @param {number} userId - The ID of the user who owns the incomes.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's incomes for the specified category.
   */
  static async getByCategoryId(categoryId, userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    if (!categoryId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("categoryId"),
      );

    return await Income.findAll({
      where: {
        categoryId: Number(categoryId),
        userId: Number(userId),
      },
    });
  }

  /**
   * Get incomes by both account ID and category ID.
   *
   * @param {number} accountId - The ID of the account to filter incomes.
   * @param {number} categoryId - The ID of the category to filter incomes.
   * @param {number} userId - The ID of the user who owns the incomes.
   * @returns {Promise<Array>} A Promise that resolves to an array with all the user's incomes for the specified account and category.
   */
  static async getByAccountIdAndCategoryId(accountId, categoryId, userId) {
    if (!userId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );

    if (!categoryId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("categoryId"),
      );

    if (!accountId)
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("accountId"),
      );

    return await Income.findAll({
      where: {
        accountId: Number(accountId),
        categoryId: Number(categoryId),
        userId: Number(userId),
      },
    });
  }

  /**
   * Check if an income with the given ID and user ID exists.
   *
   * @param {number} id - The ID of the income to check for existence.
   * @param {number} userId - The ID of the user who owns the income.
   * @returns {Promise<boolean>} A Promise that resolves to true if the income exists, otherwise false.
   */
  static async exists(id, userId) {
    if (!id) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("id"),
      );
    }

    if (!userId) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );
    }

    return (
      (await Income.count({
        where: { id: Number(id), userId: Number(userId) },
      })) > 0
    );
  }

  /**
   * Create a new income.
   *
   * @param {Object} income - The income object to be created.
   * @param {number} userId - The ID of the user who owns the income.
   * @returns {Promise<Object>} A Promise that resolves to the created income object.
   */
  static async create(income, userId) {
    if (!userId) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );
    }

    income = { ...income, userId: userId };

    await incomeSchema
      .strict()
      .validate(income, { abortEarly: false })
      .catch((err) => {
        throw new ApiValidationError(
          errorConstants.MSG_VALIDATION_ERROR,
          err.errors,
        );
      });

    const createdIncome = await Income.create(income);

    if (createdIncome.isPaid) {
      await createTransactionFromIncome(
        createdIncome,
        TransactionTypesEnum.DEPOSIT,
      );
    }

    return createdIncome;
  }

  /**
   * Update an existing income based on the ID and user ID.
   *
   * @param {Object} income - The income object to be updated.
   * @param {number} id - The ID of the income to be updated.
   * @param {number} userId - The ID of the user who owns the income.
   * @returns {Promise<Object>} A Promise that resolves to the updated income object.
   */
  static async updateById(income, id, userId) {
    if (!userId) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );
    }

    if (!id) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("id"),
      );
    }

    const incomeBeforeUpdt = await this.getById(id, userId);
    if (!incomeBeforeUpdt)
      throw new ApiNotFoundError(
        ErrorMessageFormatter.notFound(`Income ID: ${id}`),
      );

    const errors = await validatePresentProps(income, incomeSchema);
    if (!errors.isEmpty())
      throw new ApiValidationError(
        errorConstants.MSG_VALIDATION_ERROR,
        errors.getErrors(),
      );

    await Income.update(income, {
      where: {
        id: Number(id),
      },
    });

    const updatedIncome = await this.getById(id, userId);

    const hasChangedIsPaidField =
      incomeBeforeUpdt.isPaid !== updatedIncome.isPaid;

    if (hasChangedIsPaidField)
      await handleIncomeIsPaidChange(updatedIncome).catch(async (err) => {
        if (err.name === "AccountBalanceError") {
          return await handleAccountBalanceError(err, income);
        }
      });

    return updatedIncome;
  }

  /**
   * Delete an existing income based on the ID and user ID.
   *
   * @param {number} id - The ID of the income to be deleted.
   * @param {number} userId - The ID of the user who owns the income.
   * @returns {Promise<number>} A Promise that resolves with the number of deleted rows (0 or 1).
   */
  static async deleteById(id, userId) {
    if (!userId) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("userId"),
      );
    }

    if (!id) {
      throw new ApiInvalidArgumentError(
        ErrorMessageFormatter.missingArgument("id"),
      );
    }

    const income = await this.getById(id, userId);
    if (!income)
      throw new ApiNotFoundError(ErrorMessageFormatter.notFound("income"));

    let canDeleteIncome = true;

    if (income.isPaid) {
      await createTransactionFromIncome(
        income,
        TransactionTypesEnum.WITHDRAWL,
      ).catch((err) => {
        canDeleteIncome = false;

        if (err.name === "AccountBalanceError") {
          throw new ApiValidationError(
            "Cant delete income it will exceed the account overdraft limit",
          );
        } else throw err;
      });
    }

    if (canDeleteIncome) {
      return await Income.destroy({
        where: {
          id: Number(id),
          userId: Number(userId),
        },
      });
    }
  }
}

module.exports = IncomeService;
