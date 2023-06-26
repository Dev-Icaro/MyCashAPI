
class Validator {
   static isEmail(email) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
   };
   
   static isNumber(value) {
      return typeof value === 'number';
   }

   static isNull(value) {
      return typeof value === 'undefined';
   }

   static isEmpty(value) {
      return value.trim().length() === 0
   }
}


module.exports = { Validator };