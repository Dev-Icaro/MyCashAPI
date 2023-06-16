const { selectCount, checkRegExists } = require('../utils/model-utils');
const { validateEmail } = require('./generic-validators');
const { ERROR_MISSING_FIELD, ERROR_ALREDY_REGISTERED, ERROR_INVALID_FORMAT } = require('../constants/error-constants');

class UserValidator {
   constructor(userData) {
      this.userData = userData;
      this.errors = [];
   };

   isDataValid() {
      return (this.errors.length == 0);
   };

   getErrors() {
      return this.errors;
   };

   async validateData() {
      await Promise.all([
         this.validateUsername(),
         this.validatePassword(),
         this.validateEmail(),
         this.validateFullName()
      ]);
   };

   async validateUsername() {
      let username = this.userData.username;

      if (!username) this.errors.push(ERROR_MISSING_FIELD + 'username');

      let where = { username: String(username) };
      if (await checkRegExists('users', where)) this.errors.push(ERROR_ALREDY_REGISTERED + 'username');
   };

   async validatePassword() {
      let password = this.userData.password;

      if (!password) this.errors.push(ERROR_MISSING_FIELD + 'password');
   };

   async validateEmail() {
      let email = this.userData.email;

      if (!email) this.errors.push(ERROR_MISSING_FIELD + 'email');

      if (!validateEmail(email)) this.errors.push(ERROR_INVALID_FORMAT + 'email');

      let where = { email: String(email) };
      if (await checkRegExists('users', where)) this.errors.push(ERROR_ALREDY_REGISTERED + 'email');
   }

   async validateFullName() {
      if (!this.userData.firstName) this.errors.push(ERROR_MISSING_FIELD + 'firstName');
      if (!this.userData.lastName) this.errors.push(ERROR_MISSING_FIELD + 'lastName');
   }
};

module.exports = UserValidator;