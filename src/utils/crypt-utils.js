const bcrypt = require('bcrypt');
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';

/**
 * @param {string} s - string que queremos criar efetuar o hash
 * @returns {Promise<string>} - Promise que o resolve é o hash da string
 * 
 * @example
 * const hashedString = await hashString(string);
 */
async function hashString(s) {
   let saltRounds = 10;

   return await new Promise((resolve, reject) => {
      bcrypt.hash(s, saltRounds, (err, hashedString) => {
         if (err) {
            reject(err);
         } 
         else {
            resolve(hashedString);
         }
      });
   });
}

/**
 * Compara o hash criado pela função "hashString" com um valor limpo
 * 
 * @param {string} value1 - Recebe um hash ou texto plano 
 * @param {string} value2 - Recebe um hash ou text plano 
 * @returns {Promise<boolean>} - Promise onde o resolve é uma booleana 
 * dizendo se é igual ou não
 *  
 * @example 
 * const isValidPass = await isHashEqual(pass, hashedPass));
 */
async function isHashEqual(value1, value2) {
   return await new Promise((resolve, reject) => {
      bcrypt.compare(value1, value2, (err, result) => {
         if (err) {
            reject(err);  
         }
         else {
            resolve(result);
         }
      });
   });
}

/**
 * Criptografa uma string com a lib crypto. 
 * 
 * @param {string} text - String que queremos criptografar.
 * @returns {Promise<string>} - Promise onde o resolve é a string criptografada.
 * 
 * @example
 * const encryptedString = await encrypt(string);
 */
async function encrypt(text) {
   return new Promise((resolve, reject) => {
      const cipher = crypto.createCipheriv(algorithm, process.env.API_SECRET);
      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      resolve(encrypted);
   })
}

/**
 * Descriptografa a criptografia gerada pela função encrypt.
 * 
 * @param {string} encrypted - String que desejamos descriptografar.
 * @returns {Promise<string>} - Promise onde o resolve é a string descriptografada
 * 
 * @example
 * const decryptedString = await decrypt(encryptedString);
 */
async function decrypt(encrypted) {
   return new Promise((resolve, reject) => {
      const decipher = crypto.createDecipheriv(algorithm, process.env.API_SECRET);
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      resolve(decrypted);
   })
}

module.exports = { hashString, isHashEqual, encrypt, decrypt };