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
const logs_1 = require("../middleware/logs");
const validationSchema_1 = require("../middleware/validationSchema");
const errorHandler_1 = require("../middleware/errorHandler");
const utils_1 = require("../db/queries/utils");
const constants_1 = require("../utils/constants");
const express = require("express");
const router = express.Router();
const updatePartialStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { index } = req.params;
        const result = yield (0, orders_1.patchPartialStatus)(Number(index));
        if (!result)
            throw new Error(`Failed to patch partial status `);
        res.send({ status: 1, token: req.headers.newToken });
    }
    catch (error) {
        next(error);
    }
});
const addParcel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        next(error);
    }
});
const deletePart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lineId } = req.body;
        if (!lineId)
            return res.status(400).send({ token: req.headers.newToken });
        yield (0, orders_1.removePartFromOrder)(lineId);
        res.send({ token: req.headers.newToken });
    }
    catch (error) {
        next(error);
    }
});
const updatePart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { description, count, dateDue, lineId } = req.body;
        description && (yield (0, utils_1.updateDescription)(description, lineId));
        count && (yield (0, utils_1.updateTotalOrdered)(count, lineId));
        dateDue && (yield (0, orders_1.updateDateDue)(dateDue, lineId));
        res.send({ status: constants_1.STATUS_SUCCESS, token: req.headers.newToken });
    }
    catch (error) {
        next(error);
    }
});
router.patch("/set-partial/:index?", (0, validate_1.validate)(validationSchema_1.ORDER_SET_PARTIAL), (0, logs_1.addLog)("setPartial"), updatePartialStatus);
router.put("/add-parcel/", (0, validate_1.validate)(validationSchema_1.ORDER_ADD_PARCEL), (0, logs_1.addLog)("addParcel"), addParcel);
router.post("/delete/", (0, validate_1.validate)(validationSchema_1.ORDER_DELETE), deletePart);
router.post("/update/", (0, validate_1.validate)(validationSchema_1.ORDER_UPDATE), updatePart);
router.use(errorHandler_1.errorHandler);
module.exports = router;
