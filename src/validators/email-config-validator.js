const errorConstants = require('../constants/error-constants');
const { isNumber } = require('../validators/generic-validators.js');

class EmailConfigValidator {
   constructor() {
      this.errors = [];
   }

   isDataValid() {
      return this.errors.length === 0;
   }

   getErrors() {
      return this.errors;
   }

   async validate(EmailConfig) {
      await Promise.all([
         this.validateServer(EmailConfig.server),
         this.validatePort(EmailConfig.port),
         this.validateUsername(EmailConfig.username),
         this.validatePassword(EmailConfig.password),
         this.validateUseTLS(EmailConfig.useTLS),
         this.validateUseSSL(EmailConfig.useSSL)
      ]);
   }

   validateServer(server) {
      if (!server)
         this.errors.push(errorConstants.ERROR_MISSING_FIELD + 'server');
   }

   validatePort(port) {
      if (!port)
         return this.errors.push(errorConstants.ERROR_MISSING_FIELD + 'port');

      if (!isNumber(port))
         this.errors.push(errorConstants.ERROR_INVALID_FORMAT + 'port');
   }

   validateUsername(username) {
      if (!username)
         this.errors.push(errorConstants.ERROR_MISSING_FIELD + 'username');
   }

   validatePassword(password) {
      if (!password)
         this.errors.push(errorConstants.ERROR_MISSING_FIELD + 'password');
   }

   validateUseSSL(useSSL) {
      if (typeof useSSL !== 'boolean')
         this.errors.push(errorConstants.ERROR_INVALID_FORMAT + 'useSSL');
   }

   validateUseTLS(useTLS) {
      if (typeof useTLS !== 'boolean')
         this.errors.push(errorConstants.ERROR_INVALID_FORMAT + 'useTLS');
   }
}

module.exports = EmailConfigValidator