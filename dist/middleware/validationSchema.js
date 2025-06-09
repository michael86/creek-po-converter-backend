"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ORDER_SET_PARTIAL = exports.ORDER_ADD_PARCEL = exports.ORDER_DELETE = exports.ORDER_UPDATE = void 0;
const express_validator_1 = require("express-validator");
exports.ORDER_UPDATE = [
    (0, express_validator_1.body)("lineId").trim().isNumeric(),
    (0, express_validator_1.body)("description").optional().trim(),
    (0, express_validator_1.body)("count").optional().trim().isNumeric(),
    (0, express_validator_1.body)("dateDue").optional().trim(),
];
exports.ORDER_DELETE = [(0, express_validator_1.body)("lineId").exists().trim().isNumeric()];
exports.ORDER_ADD_PARCEL = [
    (0, express_validator_1.body)("parcels.*").exists().trim().isNumeric(),
    (0, express_validator_1.body)("index").exists().trim().isNumeric(),
];
exports.ORDER_SET_PARTIAL = [(0, express_validator_1.param)("index").exists().trim().isNumeric()];
