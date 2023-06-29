const bodyParser = require('body-parser');
const authRoute = require('./auth-route');
const configRoute = require('./config-route');
const { authenticationMiddleware } = require('../middlewares/authentication-middleware');
 
module.exports = app => {
   app.use(
      bodyParser.json(),
      authRoute,
      // Rotas públicas ficam acima do authMiddleware 
      authenticationMiddleware,
      // Rotas prívadas abaixo do authMiddleware 
      configRoute
   );
};