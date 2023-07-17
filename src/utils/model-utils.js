const dataBase = require('../models');

/**
 * Executa o método count com base no model e cláusula where
 * que serve para obter a quantidade de registros existêntes com 
 * determinada condição.
 * 
 * @param {string} model - O Nome do model desejado.
 * @param {Object} whereClouse - Cláusula where do sequelize sem o
 * prefixo 'where'.
 * @returns {number} - Quantidades de registros encontrados.
 * 
 * @example
 * const where = { firstName: String(name) };
 * const countNames = await selectCount('Users', where);
 */
async function selectCount(model, whereClouse) {
   return await dataBase[model].count({ where: whereClouse });
};

/**
 * Verifica se um registro existe com base no model e cláusula where.
 * 
 * @param {string} model - O nome do model desejado.
 * @param {Object} whereClouse - Cláusula where do sequelize sem o
 * prefixo 'where'.
 * @returns {boolean} - Retorna uma booleana indicando se existe.
 * 
 * @example
 * const where = { id: Number(id) };
 * const userExists = await checkRegExists('User', where);
 */
async function checkRegExists(model, whereClouse) {
   return (await selectCount(model, whereClouse) > 0);
}


module.exports = { selectCount, checkRegExists };