const dataBase = require('../models');

async function selectCount(model, whereClouse) {
   model = dataBase[model];

   return await model.count({ where: whereClouse });
};

module.exports = { selectCount };