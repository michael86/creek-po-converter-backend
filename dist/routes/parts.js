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
exports.router = void 0;
const express = require("express");
exports.router = express.Router();
const isPrefixValid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prefix } = req.params;
    if (!prefix) {
        res.status(400).send({ token: req.headers.newToken });
    }
    res.status(200).send({ token: req.headers.newToken });
    console.log(req.params);
});
exports.router.get("/prefix/is-valid/:prefix?", isPrefixValid);
module.exports = exports.router;
