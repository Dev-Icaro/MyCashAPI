const express = require("express");
const routes = require("./routes");
require("dotenv").config({ path: "config/.env" });

app = express();
routes(app);

const PORT = process.env.PORT;
app.listen(PORT, () => {
   console.log(`MyCash online na porta ${PORT}`);
});

module.exports = app;
