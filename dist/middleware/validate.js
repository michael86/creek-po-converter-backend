"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateQuery = void 0;
const express_validator_1 = require("express-validator");
const validateQuery = (req, res, next) => {
    const params = Object.keys(req.params);
    for (const param of params) {
        const valid = (0, express_validator_1.query)().notEmpty();
    }
    next();
};
exports.validateQuery = validateQuery;
