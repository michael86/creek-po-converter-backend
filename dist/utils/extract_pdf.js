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
exports.testFiles = exports.processFile = void 0;
const pdf2table = require("pdf2table");
const fs = require("fs/promises");
const path = require("path");
const pdfFolder = path.resolve(__dirname, "../public/pdf");
// Prefixes to match against in PDF content
const PREFIXES = [
    "econn",
    "ecapt",
    "erest",
    "einci",
    "etras",
    "etran",
    "eleds",
    "ecry",
    "esensor",
    "emodu",
    "epart",
    "efix",
    "etool",
    "epcbs",
    "ewire",
    "ecilp",
    "efuse",
    "elink",
    "erely",
    "eswtc",
    "ediod",
    "se000",
    "eindu",
    "econv",
    "ereg",
    "ether",
    "emtwk",
    "epotn",
    "esold",
    "etrim",
    "ebat",
    "epcb",
    "ecirb",
];
// Extracts relevant data from table rows
const getData = (rows) => {
    const data = [];
    rows.forEach((row, index) => {
        console.log("row", row);
        row.forEach((string) => {
            PREFIXES.forEach((prefix) => {
                var _a;
                string = string.toLowerCase();
                if (string.includes(prefix) && ((_a = row[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== "stencil") {
                    row.length > 4 && data.push([row[1], Math.floor(+row[row.length - 2]).toString()]);
                    console.log(row);
                    console.log("description ", rows[index + 1]);
                }
            });
        });
    });
    console.log("data ", data);
    return data;
};
// Extracts order reference from table rows
const getOrderReference = (rows) => {
    var _a;
    let filtered = rows.filter((row) => row.length === 3 && row[0].toLowerCase().includes("order refer"));
    if (!((_a = filtered[0]) === null || _a === void 0 ? void 0 : _a[1]))
        throw new Error("Failed to get order reference");
    return filtered[0][1];
};
// Extracts purchase order from table rows
const getPurchaseOrder = (rows) => {
    var _a;
    let filtered = rows.filter((row) => row.length === 3 && row[0].toLowerCase().includes("our p.o"));
    if (!((_a = filtered[0]) === null || _a === void 0 ? void 0 : _a[1]))
        throw new Error("Failed to get P.O");
    return filtered[0][1];
};
// Processes a single PDF file
const processFile = (file, cb) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileData = yield fs.readFile(path.resolve(pdfFolder, file));
        pdf2table.parse(fileData, function (err, rows) {
            if (err)
                return console.log(err);
            const DATA = getData(rows);
            const ORDER_REFERENCE = getOrderReference(rows);
            const PURCHASE_ORDER = getPurchaseOrder(rows);
            if (DATA.length) {
                cb({
                    DATA,
                    ORDER_REFERENCE,
                    PURCHASE_ORDER,
                });
                return;
            }
            cb(null);
        });
    }
    catch (error) {
        console.error(`Error processing file ${file}: `, error);
        cb(null);
    }
});
exports.processFile = processFile;
const testFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dir = yield fs.readdir(pdfFolder);
        const retval = [];
        for (const file of dir) {
            yield (0, exports.processFile)(file, (data) => {
                if (data)
                    retval.push(data);
            });
        }
        return retval;
    }
    catch (error) {
        console.error("Error reading PDF files: ", error);
        return [];
    }
});
exports.testFiles = testFiles;
