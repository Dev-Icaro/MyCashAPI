const { param } = require("express-validator");
const ErrorMessageFormatter = require("../utils/error-message-formatter");

const validateIdParam = () => [
  param("id")
    .exists()
    .withMessage()
    .bail()
    .trim()
    .notEmpty()
    .withMessage(ErrorMessageFormatter.missingParam("id"))
    .bail()
    .isInt()
    .withMessage(ErrorMessageFormatter.notInteger("id"))
    .bail(),
];

module.exports = { validateIdParam };
