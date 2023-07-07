const bcrypt = require('bcrypt');
const crypto = require('crypto');
const algorithm = 'aes-128-cbc';

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
 * @returns {Promise<string>} - Promise onde o resolve é a string criptografada e
 * o iv utilizado na criptografia para poder ser armazenado.
 * 
 * @example
 * const [encryptedString, iv] = await encrypt(string);
 */
async function encrypt(text) {
   return new Promise((resolve, reject) => {
      let iv = crypto.randomBytes(16);
      const key = process.env.API_SECRET;

      const cipher = crypto.createCipheriv(algorithm, key, iv);

      let encrypted = cipher.update(text, 'utf8', 'hex');
      encrypted += cipher.final('hex');

      // Converto o buffer em um base64 para armazenar no banco.
      iv = iv.toString('base64');

      resolve([encrypted, iv]);
   })
}

/**
 * Descriptografa a criptografia gerada pela função encrypt.
 * 
 * @param {string} encrypted - String que desejamos descriptografar.
 * @param {string} iv - Iv (Initialization vector) utilizado na criptografia.
 * @returns {Promise<string>} - Promise onde o resolve é a string descriptografada
 * 
 * @example
 * const iv = getIv();
 * const decryptedString = await decrypt(encryptedString, iv);
 */
async function decrypt(encrypted, iv) {
   return new Promise((resolve, reject) => {
      // Converto o iv base64 em buffer novamente.
      iv = Buffer.from(iv, 'base64');
      const key = process.env.API_SECRET;

      const decipher = crypto.createDecipheriv(algorithm, key, iv);

      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');

      resolve(decrypted);
   })
}

module.exports = { hashString, isHashEqual, encrypt, decrypt };