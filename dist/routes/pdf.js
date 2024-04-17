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
const { insertDataToDb, fetchPurchaseOrders, fetchPurchaseOrder } = require("../sql/queries");
const express = require("express");
const multer = require("multer");
const router = express.Router();
const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, "public/pdf/");
    },
    filename: (_req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadStorage = multer({ storage: storage });
const process = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.file)
            throw new Error("no file fount");
        (0, extract_pdf_1.processFile)(req.file.filename, (data) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('data ', data);
            if (!data) {
                res.send({ status: 3, token: req.headers.newToken });
                return;
            }
            const inserted = yield insertDataToDb(data);
            if (inserted === "dupe") {
                res.send({ status: 4, token: req.headers.newToken });
                return;
            }
            if (!inserted) {
                console.log(`Error Processing PDF (inserted) ${inserted}`);
                res.status(500).send({ status: 2 });
                return;
            }
            res.send({ status: 1, token: req.headers.newToken });
        }));
    }
    catch (err) {
        console.log(`Error Processing PDF (err) ${err}`);
        res.status(500).send({ status: 2 });
    }
});
const fetch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        const purchaseOrders = yield fetchPurchaseOrders();
        res.send({
            status: 1,
            data: purchaseOrders.map((po) => po.purchaseOrder),
            token: req.headers.newToken,
        });
        return;
    }
    const purchaseOrder = yield fetchPurchaseOrder(req.params.id);
    res.send({ status: 1, data: purchaseOrder, token: req.headers.newToken });
});
router.post("/process", uploadStorage.single("pdf"), process);
router.get("/fetch/:id?", fetch);
module.exports = router;
