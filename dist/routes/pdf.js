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
const extract_pdf_1 = require("../utils/extract_pdf");
const orders_1 = require("../db/queries/orders");
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const logs_1 = require("../middleware/logs");
require("dotenv").config();
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
router.post("/process", uploadStorage.single("pdf"), (0, logs_1.addLog)("fileUpload"), beginProcess);
router.get("/fetch/:id?", (0, validate_1.validate)([(0, express_validator_1.param)("id").trim()]), (0, logs_1.addLog)("fetchPo"), fetch);
module.exports = router;
