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
    destination: (req, file, cb) => {
        cb(null, "public/pdf/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});
const uploadStorage = multer({ storage: storage });
router.post("/process", uploadStorage.single("pdf"), function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.file)
                throw new Error("no file fount");
            (0, extract_pdf_1.processFile)(req.file.filename, (data) => __awaiter(this, void 0, void 0, function* () {
                if (!data)
                    throw new Error("Failed to parse data from file");
                const inserted = yield insertDataToDb(data);
                if (!inserted)
                    throw new Error("failed to insert into database");
                res.send({ status: 1, token: req.headers.newToken });
            }));
        }
        catch (err) {
            console.log(`Error Processing PDF`);
            res.status(500).send({ status: 2 });
        }
    });
});
router.get("/fetch/:id?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.params.id) {
        const purchaseOrders = yield fetchPurchaseOrders();
        res.send({ status: 1, data: purchaseOrders, token: req.headers.newToken });
        return;
    }
    const purchaseOrder = yield fetchPurchaseOrder(req.params.id);
    res.send({ status: 1, data: purchaseOrder, token: req.headers.newToken });
}));
module.exports = router;
