import { validateToken } from "./middleware";

import { testFiles } from "./utils/extract_pdf";
const { createSqlConnection } = require("./sql/connection");
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 6005;

require("dotenv").config();
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());

app.use("/pdf", validateToken, require("./routes/pdf"));
app.use("/account", require("./routes/account"));
app.use("/purchase/", validateToken, require("./routes/purchase_orders"));
app.use("/parts/", validateToken, require("./routes/parts"));
app.use("/locations/", validateToken, require("./routes/locations"));
app.use("/logs/", validateToken, require("./routes/logs"));

app.listen(6005, async () => {
  console.log(`listening port ${port}\nServer started`);
  console.log("connecting to database");
  createSqlConnection();
});

//uncomment to test files
// (async () => {
//   const data = await testFiles();
// })();
