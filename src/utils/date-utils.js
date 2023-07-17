/**
 * Formata uma data para o padrão MySql.
 * 
 * @param {Object<Date>} date - Espera uma instância de date
 * @returns {Object<Date>} - Data formatada no padrão MySql 'aaaa-mm-dd hh:mm:ss'
 * 
 * @example
 * const date = new Date();
 * console.log(formatMySqlDateTime(date)); // Output: '2023-07-04 23:44:22'
 */
function formatMySqlDateTime(date) {
   return date.toISOString().slice(0, 19).replace('T', ' ');
}

module.exports = { formatMySqlDateTime }