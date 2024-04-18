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
const { fetchPrefixes } = require("../sql/queries");
/**
 *
 * @param rows
 * @returns
 */
const getData = (rows) => {
    const data = [];
    rows.forEach((row, index) => {
        const lowerCasedRow = row.map((entry) => entry.toLowerCase());
        const nextRow = rows[index + 1] || [];
        lowerCasedRow.forEach((string) => {
            if (shouldIncludeString(string, lowerCasedRow)) {
                const quantityIndex = row.length - 2;
                const quantity = Math.floor(+row[quantityIndex]).toString();
                const nextRowFirstElement = nextRow[0] || "";
                data.push([row[1], quantity, nextRowFirstElement]);
            }
        });
    });
    return data;
};
const shouldIncludeString = (string, row) => {
    const prefixes = fetchPrefixes();
    return prefixes.some((prefix) => string.includes(prefix) && row[1] !== "stencil" && row.length > 4);
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
