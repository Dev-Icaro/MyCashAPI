// Requires
const { MSG_USER_CREATED }     = require('../constants/user-constants');
const { formatInvalidDataResponse } = require('../utils/service-response-formatter');
const UserValidator                 = require('../validators/user-validator');
const dataBase                      = require('../models');

const usersModel = dataBase.users;

class AuthService {
   static async registerAccount(userJson) {
      let validator = new UserValidator(userJson);
      await validator.validateData();

      if (!validator.isDataValid())
         return { statusCode: 400, message: validator.getErrors() };

      await usersModel.create(userJson);

      return { statusCode: 200, message: MSG_USER_CREATED};
   };
}

module.exports = AuthService;