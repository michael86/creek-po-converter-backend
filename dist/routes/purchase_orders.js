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
const express = require("express");
const router = express.Router();
const updatePartialStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order, name } = req.params;
        const result = yield (0, orders_1.patchPartialStatus)(order, name);
        if (!result)
            throw new Error(`Failed to patch partial status \nOrder:${order} \nName${name}`);
        res.send({ status: 1, token: req.headers.newToken });
    }
    catch (error) {
        console.error(`error setting part_number to partial parcel: ${error}`);
        res.status(500).send({ status: 0 });
    }
});
const addParcel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { parcels, purchaseOrder, part } = req.body;
        if (!parcels || !purchaseOrder || !part) {
            res.status(400).send();
            return;
        }
        const result = yield (0, orders_1.addParcelsToOrder)(parcels, purchaseOrder, part);
        res.send({ status: result ? 1 : 0, token: req.headers.newToken });
    }
    catch (error) {
        console.error(`error trying to add new parcels to order ${error}`);
        res.send({ status: 0 });
    }
});
router.patch("/set-partial/:order?/:name?", (0, validate_1.validate)([(0, express_validator_1.param)("order").exists().trim(), (0, express_validator_1.param)("name").exists().trim()]), updatePartialStatus);
router.put("/add-parcel/", (0, validate_1.validate)([
    (0, express_validator_1.body)("parcels.*").exists().trim().isNumeric(),
    (0, express_validator_1.body)("purchaseOrder").trim().exists(),
    (0, express_validator_1.body)("part").exists().trim(),
]), addParcel);
module.exports = router;
