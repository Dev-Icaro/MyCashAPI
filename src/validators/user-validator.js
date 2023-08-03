const UserService = require("../services/user-service");

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

module.exports = { yupUserExists };
