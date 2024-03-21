import { processFile, testFiles } from "./modules/extract_pdf";

const express = require("express");
const app = express();
const cors = require("cors");

require("dotenv").config();
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());

app.use("/pdf", require("./routes/pdf"));

const port = process.env.PORT || 6005;
app.listen(6005, async () => {
  console.log(`listening port ${port}\nServer started`);
});

//uncomment to test files
// (async () => {
//   const data = await testFiles();
// })();
