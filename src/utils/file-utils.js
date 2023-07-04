const fs = require('fs');

/**
 * Verifica se um arquivo existe ou não no computador.
 * 
 * @param {string} path - O caminho do arquivo que deseja.
 * validar a existência.
 * @returns {boolean} - Booleana indicando se existe ou não.
 * 
 * @example
 * const isValidFile = fileExists(filePath);
 */
function fileExists(path) {
   return fs.existsSync(path) ? true : false;
}

module.exports = { fileExists };