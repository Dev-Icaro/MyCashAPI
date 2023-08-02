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

class IncomeService {
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
