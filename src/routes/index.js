const bodyParser = require("body-parser");
const authRoute = require("./auth-route");
const configRoute = require("./config-route");
const accountRoute = require("./account-route");

module.exports = (app) => {
   app.use(bodyParser.json(), authRoute, configRoute, accountRoute);
};
