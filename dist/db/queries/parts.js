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
exports.insertPrefix = exports.fetchPrefixes = void 0;
const connection_1 = require("../connection");
const fetchPrefixes = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const prefixes = yield (0, connection_1.runQuery)(`select prefix from prefixes`, []);
        if ("code" in prefixes)
            throw new Error(`error fetching prefixes \n${prefixes}`);
        return prefixes.map((entry) => entry.prefix);
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.fetchPrefixes = fetchPrefixes;
const insertPrefix = (prefix) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`insert into prefixes (prefix) values (?)`, [prefix]);
        if ("code" in res)
            throw new Error(`error fetching prefixes \n${res}`);
        return true;
    }
    catch (error) {
        console.error(`error inserting prefix ${error}`);
        return;
    }
});
exports.insertPrefix = insertPrefix;
