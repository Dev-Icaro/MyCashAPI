const { param } = require("express-validator");
const Yup = require("yup");
const { ApiInvalidArgumentError } = require("../errors/argument-errors");
const ApiValidationResult = require("../helpers/api-validation-result");
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

/**
 * Get a specific property schema from a schema.
 *
 * @function
 * @param {string} propName - Name of the property that we want the schema.
 * @param {Yup.ObjectSchema} - The master schema that we want to get the prop schema.
 * @throws {ApiInvalidArgumentError} Throws an error if the property schema does not exist.
 * @returns {Yup.ObjectSchema} - The schema for the specified property.
 */
const getPropSchema = (propName, schema) => {
  const propSchema = schema.fields[propName];

  if (!propSchema) {
    throw new ApiInvalidArgumentError(
      `Invalid schema for property: ${propName}`,
    );
  }

  return Yup.object().shape({
    [propName]: propSchema,
  });
};

/**
 * Validate only the present props of an object based on the
 * schema passed as parameter, useful for validate update operations that
 * we want to validate just the present properties and not the object at all.
 *
 * @param {object} object - Object to be validate.
 * @param {Yup.ObjectSchema} schema - Master schema that we want to based on.
 * @returns {ApiValidationResult} - An helper class containing the errors and aux methods.
 */
const validatePresentProps = async (object, schema) => {
  let errors = new ApiValidationResult();
  for (let prop in object) {
    await getPropSchema(prop, schema)
      .validate(object)
      .catch((err) => errors.addError(err.errors));
  }
  return errors;
};

module.exports = { validateIdParam, validatePresentProps };
