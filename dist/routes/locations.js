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
const locations_1 = require("../db/queries/locations");
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const logs_1 = require("../middleware/logs");
const express = require("express");
const router = express.Router();
const updateLocation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { location, line } = req.body;
        if (!location || !line) {
            res.status(400).send({ token: req.headers.newToken });
        }
        const locationId = yield (0, locations_1.selectLocationId)(location);
        if (!locationId)
            throw new Error("Failed to select location id");
        const updated = yield (0, locations_1.patchLocation)(locationId, line);
        if (!updated)
            throw new Error(`Failed to insert location for part`);
        res.send({ token: req.headers.newToken });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ token: req.headers.newToken });
    }
});
router.post("/update", (0, validate_1.validate)([(0, express_validator_1.body)("line").trim().notEmpty().isNumeric(), (0, express_validator_1.body)("location").trim().notEmpty()]), (0, logs_1.addLog)("updateLocation"), updateLocation);
module.exports = router;
