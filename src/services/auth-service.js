// Requires
const { MSG_USER_CREATED, ERROR_USER_NOT_FOUND }        = require('../constants/user-constants');
const UserValidator               = require('../validators/user-validator');
const dataBase                    = require('../models');
const { hashString, isHashEqual } = require('../utils/bcrypt-utils');
const { generateToken } = require('../utils/auth-utils');
const { MSG_INCORRECT_PASSWORD } = require('../constants/auth-constants');

const usersModel = dataBase.users;

class AuthService {
   static async registerAccount(userJson) {
      let validator = new UserValidator(userJson);
      await validator.validateData();

      if (!validator.isDataValid())
         return { statusCode: 400, message: validator.getErrors() };
      
      userJson.password = await hashString(userJson.password);

      await usersModel.create(userJson);

      return { statusCode: 200, message: MSG_USER_CREATED};
   };


   static async login(credentialsJson) {
      let user = await usersModel.findUserByEmail(credentialsJson.email);

      if (!user) 
         return { statusCode: 401, message: ERROR_USER_NOT_FOUND }

      if (!await isHashEqual(credentialsJson.password, user.password)) 
         return { statusCode: 401, message: MSG_INCORRECT_PASSWORD } 

      let payload = {
         id: user.id,
         username: user.username
      }

      let token = generateToken(payload);

      return { statusCode: 200, token };
   };
};

module.exports = AuthService;