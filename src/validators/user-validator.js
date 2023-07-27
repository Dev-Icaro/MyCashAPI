const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const UserService = require("../services/user-service");
const ErrorMessageFormatter = require("../utils/error-message-formatter");

/**
 * Validate an userId.
 *
 * @param {number} id - The user ID that you want to validate.
 * @returns {boolean} - An convention bool to indicate that its valid
 * @throws {ApiInvalidArgumentError} - Error indicating that it's not valid.
 */
async function validateUserId(id) {
  if (!id)
    throw new ApiInvalidArgumentError(ErrorMessageFormatter.notEmpty("userId"));

  if (!typeof id === "number")
    throw new ApiInvalidArgumentError(
      ErrorMessageFormatter.notInteger("userId"),
    );

  if (!(await UserService.getById(id)))
    throw new ApiInvalidArgumentError(ErrorMessageFormatter.notFound("userId"));

  return true;
}

/**
 * Function used to validate an user ID in Yup validation Schema
 * Obs: It could fail out of Yup schema scope.
 *
 * @param {number} userId - The user ID to be validate, Yup will assign this variable
 * if you pass it as an argument in the test method.
 * @returns {boolean} - Yup convention to indicate that its valid.
 * @throws {Error} - Yup convention to indicate that its fail.
 */
const yupUserExists = async function (userId) {
  return await UserService.exists(userId);
};
module.exports = { validateUserId, yupUserExists };
