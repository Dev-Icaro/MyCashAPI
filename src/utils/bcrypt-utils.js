const bcrypt = require('bcrypt');

async function hashString(s) {
   let saltRounds = 10;

   return await new Promise((resolve, reject) => {
      bcrypt.hash(s, saltRounds, (err, hashedString) => {
         if (err) {
            reject(err);
         } 
         else {
            resolve(hashedString);
         };
      });
   });
};

async function isHashEqual(value1, value2) {
   return await new Promise((resolve, reject) => {
      bcrypt.compare(value1, value2, (err, result) => {
         if (err) {
            reject(err);  
         }
         else {
            resolve(result);
         };
      });
   });
};

module.exports = { hashString, isHashEqual };