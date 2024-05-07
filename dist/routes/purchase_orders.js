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
const orders_1 = require("../db/queries/orders");
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const logs_1 = require("../middleware/logs");
const express = require("express");
const router = express.Router();
const updatePartialStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { index } = req.params;
        const result = yield (0, orders_1.patchPartialStatus)(Number(index));
        if (!result)
            throw new Error(`Failed to patch partial status `);
        res.send({ status: 1, token: req.headers.newToken });
    }
    catch (error) {
        console.error(`error setting part_number to partial parcel: ${error}`);
        res.status(500).send({ status: 0 });
    }
});
const addParcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parcels, index } = req.body;
        if (!parcels || !index) {
            res.status(400).send();
            return;
        }
        const result = yield (0, orders_1.addParcelsToOrder)(parcels, index);
        res.send({ status: result ? 1 : 0, token: req.headers.newToken });
    }
    catch (error) {
        console.error(`error trying to add new parcels to order ${error}`);
        res.send({ status: 0 });
    }
});
const deletePart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lineId } = req.body;
        if (!lineId)
            return res.status(400).send({ token: req.headers.newToken });
        const result = yield (0, orders_1.removePartFromOrder)(lineId);
        res.send({ token: req.headers.newToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ token: req.headers.newToken });
    }
});
router.patch("/set-partial/:index?", (0, validate_1.validate)([(0, express_validator_1.param)("index").exists().trim().isNumeric()]), (0, logs_1.addLog)("setPartial"), updatePartialStatus);
router.put("/add-parcel/", (0, validate_1.validate)([
    (0, express_validator_1.body)("parcels.*").exists().trim().isNumeric(),
    (0, express_validator_1.body)("index").exists().trim().isNumeric(),
]), (0, logs_1.addLog)("addParcel"), addParcel);
router.post("/delete/", (0, validate_1.validate)([(0, express_validator_1.body)("lineId").exists().trim().isNumeric()]), deletePart);
module.exports = router;
