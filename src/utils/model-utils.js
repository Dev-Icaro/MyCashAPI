const dataBase = require('../models');

async function selectCount(model, whereClouse) {
   return await dataBase[model].count({ where: whereClouse });
};

async function checkRegExists(model, whereClouse) {
   return (await selectCount(model, whereClouse) > 0);
}


module.exports = { selectCount, checkRegExists };