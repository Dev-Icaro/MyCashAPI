const { param } = require("express-validator");
const ErrorMessageFormatter = require("../helpers/error-message-formatter");

const validateIdParam = () => [
  param("id")
    .exists()
    .withMessage()
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ErrorMessageFormatter.formatMissingParamErr("id"))
    .bail()
    .isInt()
    .withMessage(ErrorMessageFormatter.formatNotIntegerErr("id"))
    .bail(),
];

module.exports = { validateIdParam };
