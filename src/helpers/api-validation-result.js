/**
 * Helper class to assist in handling validation results, similar to the expressValidator's validationResult.
 */
class ApiValidationResult {
  /**
   * Creates an instance of ApiValidationResult.
   *
   * @constructor
   */
  constructor() {
    this.errors = [];
  }

  /**
   * Adds an error message.
   *
   * @param {string} error - The error message.
   */
  addError(error) {
    if (!error) {
      return;
    }

    this.errors.push(error);
  }

  /**
   * Returns the added errors.
   *
   * @returns {Array} - Array containing the added errors.
   */
  getErrors() {
    return this.errors;
  }

  /**
   * Checks if any error has been added.
   *
   * @returns {boolean} - Boolean indicating whether the instance is empty or not.
   */
  isEmpty() {
    return this.errors.length === 0;
  }
}

module.exports = ApiValidationResult;
