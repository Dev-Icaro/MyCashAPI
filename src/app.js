const express = require("express");
const routes = require("./routes");
const process = require("process");
require("dotenv").config({ path: "config/.env" });

const app = express();
routes(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`MyCash online na porta ${PORT}`);
});

module.exports = app;
