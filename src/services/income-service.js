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

    const updatedIncome = await this.getById(id);

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
}

module.exports = IncomeService;
