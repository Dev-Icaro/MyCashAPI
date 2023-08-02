const { errorHandler } = require("../middlewares/error-handlers");
const bodyParser = require("body-parser");
const authRoute = require("./auth-route");
const accountRoute = require("./account-route");
const expenseRoute = require("./expense-route");
const categoryRoute = require("./category-route");
const incomeRoute = require("./income-route");

module.exports = (app) => {
  app.use(
    bodyParser.json(),
    authRoute,
    accountRoute,
    expenseRoute,
    categoryRoute,
    incomeRoute,
    errorHandler,
  );
};
