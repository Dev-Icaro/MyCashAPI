/**
 * Formats a date to the MySql standard.
 *
 * @param {Object<Date>} date - Expects an instance of Date.
 * @returns {Object<Date>} - The formatted date in the MySql standard 'yyyy-mm-dd hh:mm:ss'.
 *
 * @example
 * const date = new Date();
 * console.log(formatMySqlDateTime(date)); // Output: '2023-07-04 23:44:22'
 */
function formatMySqlDateTime(date) {
  return date.toISOString().slice(0, 19).replace("T", " ");
}

module.exports = { formatMySqlDateTime };
