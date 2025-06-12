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
require("dotenv").config();
const pdf2table = require("pdf2table");
const fs = require("fs/promises");
const path = require("path");
const extract_pdf_1 = require("../utils/extract_pdf");
const orders_1 = require("../db/queries/orders");
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const logs_1 = require("../middleware/logs");
const pdfFolder = path.resolve(__dirname, "../public/pdf");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, process.env.DEVELOPMENT_MODE ? "dist/public/pdf/" : "public/pdf/");
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadStorage = multer({ storage: storage });
const beginProcess = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file)
            throw new Error("no file fount");
        (0, extract_pdf_1.processFile)(req.file.filename, (data) => __awaiter(void 0, void 0, void 0, function* () {
            if (!data) {
                res.send({ status: 3, token: req.headers.newToken });
                return;
            }
            const inserted = yield (0, orders_1.insertOrderToDb)(data);
            if (inserted === "ER_DUP_ENTRY") {
                res.send({ status: 4, token: req.headers.newToken });
                return;
            }
            if (!inserted) {
                console.error(`Error Processing PDF (inserted) ${inserted}`);
                res.status(500).send({ status: 2 });
                return;
            }
            res.send({ status: 1, token: req.headers.newToken });
        }));
    }
    catch (err) {
        console.error(`Error Processing PDF (err) ${err}`);
        res.status(500).send({ status: 2 });
    }
});
const fetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        const purchaseOrders = yield (0, orders_1.fetchPurchaseOrders)();
        if (!purchaseOrders) {
            res.send({ status: 0 });
            return;
        }
        res.send({
            status: 1,
            data: purchaseOrders,
            token: req.headers.newToken,
        });
        return;
    }
    const purchaseOrder = yield (0, orders_1.fetchPurchaseOrder)(req.params.id);
    res.send({ status: 1, data: purchaseOrder, token: req.headers.newToken });
});
const extractStickerTemplate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file) {
            return res.status(400).send({ status: 0, message: "No file uploaded" });
        }
        const fileName = req.file.filename;
        const fileData = yield fs.readFile(path.resolve(pdfFolder, fileName));
        const data = yield pdf2table.parse(fileData, (err, rows) => {
            if (err) {
                console.error(`Error parsing PDF: ${err}`);
                return res
                    .status(500)
                    .send({ status: 0, message: "Error processing PDF", token: req.headers.newToken });
            }
            /** Need to extract the following data from the rows:
             1. 'Order reference:'
             2. 'Part Number'
             3. 'Qty'
           
            table row starts with    ['Line',
            "Our part number",
              "Issue",
              "Your part number",
              "Units",
              "Unit net GBP price",
              "Due quantity",
              "Net GBP value"];
            
              part rows always start with a number after the table row and has 6 indexes
            */
            const orderReferenceRow = rows.find((row) => row.some((cell) => cell.toLowerCase().includes("order reference:")));
            const orderReference = orderReferenceRow[3];
            const tableRowIndex = rows.findIndex((row) => row.length === 8 &&
                row[0].toLowerCase() === "line" &&
                row[1].toLowerCase() === "our part number");
            const tableRows = rows.slice(tableRowIndex + 1);
            const data = tableRows
                .filter((row) => !isNaN(row[0]) && row.length === 6)
                .map(([_, partNumber, , , quantity]) => ({ partNumber, quantity: parseInt(quantity) }));
            return res.send({
                status: 1,
                message: "Sticker template processed successfully",
                token: req.headers.newToken,
                data: {
                    orderReference,
                    parts: data,
                },
            });
        });
    }
    catch (err) {
        console.error(`Error Processing PDF (err) ${err}`);
        res.status(500).send({ status: 2 });
    }
});
router.post("/process-sticker-template", uploadStorage.single("pdf"), (0, logs_1.addLog)("fileUpload"), extractStickerTemplate);
router.post("/process", uploadStorage.single("pdf"), (0, logs_1.addLog)("fileUpload"), beginProcess);
router.get("/fetch/:id?", (0, validate_1.validate)([(0, express_validator_1.param)("id").trim()]), (0, logs_1.addLog)("fetchPo"), fetch);
module.exports = router;
