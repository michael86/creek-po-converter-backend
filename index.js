"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
app.use(express.json());
app.use(express.static("./public"));
app.use(cors());
app.use("/pdf", require("./routes/pdf"));
const port = process.env.PORT || 6005;
app.listen(6005, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`listening port ${port}\nServer started`);
}));
//uncomment to test files
// (async () => {
//   const data = await testFiles();
// })();
