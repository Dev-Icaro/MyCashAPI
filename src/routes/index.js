const bodyParser = require('body-parser');
const authRoute = require('./auth-route');

module.exports = app => {
   app.use(
      bodyParser.json(),
      authRoute
   );
};