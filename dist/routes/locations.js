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
const utils_1 = require("../db/queries/utils");
const locations_1 = require("../db/queries/locations");
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const express = require("express");
const router = express.Router();
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order, part, location } = req.body;
        if (!order || !part || !location) {
            res.status(400).send({ token: req.headers.newToken });
        }
        const orderId = yield (0, utils_1.selectPurchaseOrderId)(order);
        if (!orderId)
            throw new Error(`Failed to select order id for ${order}`);
        const partId = yield (0, utils_1.selectPartId)(part);
        if (!partId)
            throw new Error(`Failed to select part id for ${part}`);
        const id = yield (0, locations_1.selectLocationIdForPart)(orderId, partId);
        const locationId = yield (0, locations_1.selectLocationId)(location);
        if (!locationId)
            throw new Error("Failed to select location id");
        // purchaseId, partId, location;
        const query = id
            ? `UPDATE po_pn_location SET location = ? WHERE purchase_order = ? AND part_number = ?`
            : `INSERT INTO po_pn_location (location, purchase_order, part_number) VALUES (?, ?, ?)`;
        const updated = yield (0, locations_1.insertLocation)(orderId, partId, locationId, query);
        if (!updated)
            throw new Error(`Failed to insert location for part`);
        res.send({ token: req.headers.newToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ token: req.headers.newToken });
    }
});
router.post("/update", (0, validate_1.validate)([
    (0, express_validator_1.body)("order").trim().notEmpty(),
    (0, express_validator_1.body)("part").trim().notEmpty(),
    (0, express_validator_1.body)("location").trim().notEmpty(),
]), updateLocation);
module.exports = router;
