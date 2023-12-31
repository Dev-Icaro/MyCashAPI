const bcrypt = require("bcrypt");
const crypto = require("crypto");
const process = require("process");
const { Buffer } = require("buffer");
const algorithm = "aes-128-cbc";

/**
 * Hashes a given string using bcrypt.
 *
 * @param {string} s - The string to be hashed.
 * @returns {Promise<string>} - A Promise that resolves to the hashed string.
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
      } else {
        resolve(hashedString);
      }
    });
  });
}

/**
 * Compares the hash created by the "hashString" function with a plain value.
 *
 * @param {string} value1 - A hash or plain text.
 * @param {string} value2 - A hash or plain text.
 * @returns {Promise<boolean>} - A Promise that resolves to a boolean indicating whether the values are equal or not.
 *
 * @example
 * const isValidPass = await isHashEqual(pass, hashedPass);
 */
async function isHashEqual(value1, value2) {
  return await new Promise((resolve, reject) => {
    bcrypt.compare(value1, value2, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Encrypts a string using the crypto library.
 *
 * @param {string} text - The string to be encrypted.
 * @returns {Promise<[string, string]>} - A Promise that resolves to an array containing the encrypted string and the initialization vector (IV) used in encryption.
 *
 * @example
 * const [encryptedString, iv] = await encrypt(string);
 */
async function encrypt(text) {
  return new Promise((resolve) => {
    let iv = crypto.randomBytes(16);
    const key = process.env.API_SECRET;

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    // Convert the IV buffer to base64 for storage.
    iv = iv.toString("base64");

    resolve([encrypted, iv]);
  });
}

/**
 * Decrypts the encryption generated by the "encrypt" function.
 *
 * @param {string} encrypted - The encrypted string to be decrypted.
 * @param {string} iv - The Initialization Vector (IV) used in encryption.
 * @returns {Promise<string>} - A Promise that resolves to the decrypted string.
 *
 * @example
 * const iv = getIv();
 * const decryptedString = await decrypt(encryptedString, iv);
 */
async function decrypt(encrypted, iv) {
  return new Promise((resolve) => {
    // Convert the base64 IV back to a buffer.
    iv = Buffer.from(iv, "base64");
    const key = process.env.API_SECRET;

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");

    resolve(decrypted);
  });
}

module.exports = { hashString, isHashEqual, encrypt, decrypt };
