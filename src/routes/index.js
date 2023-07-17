const { errorHandler } = require("../middlewares/error-handlers");
const bodyParser = require("body-parser");
const authRoute = require("./auth-route");
const accountRoute = require("./account-route");

module.exports = (app) => {
  app.use(bodyParser.json(), authRoute, accountRoute, errorHandler);
};
