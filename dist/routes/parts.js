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
exports.router = void 0;
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const parts_1 = require("../db/queries/parts");
const checkUserRole_1 = require("../middleware/checkUserRole");
const express = require("express");
exports.router = express.Router();
const isPrefixValid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { prefix } = req.params;
    if (!prefix) {
        res.status(400).send({ token: req.headers.newToken });
    }
    const prefixes = yield (0, parts_1.fetchPrefixes)();
    if (!prefix.length) {
        res.status(500).send({ token: req.headers.newToken });
        return;
    }
    res
        .status(200)
        .send({ token: req.headers.newToken, valid: !(prefixes === null || prefixes === void 0 ? void 0 : prefixes.includes(prefix.toLowerCase())) });
});
const addPrefix = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { prefix } = req.body;
        const inserted = yield (0, parts_1.insertPrefix)(prefix);
        if (!inserted) {
            res.status(400).send();
            return;
        }
        res.send({ token: req.headers.newToken, inserted });
    }
    catch (error) {
        console.error(error);
        res.status(400).send();
    }
});
exports.router.get("/prefix/is-valid/:prefix?", (0, validate_1.validate)([(0, express_validator_1.param)("prefix").trim().notEmpty().withMessage("prefix was empty").escape()]), (0, checkUserRole_1.checkUserRoleForAction)(4), isPrefixValid);
exports.router.put("/prefix/add/", (0, validate_1.validate)([(0, express_validator_1.body)("prefix").trim().notEmpty().withMessage("prefix was empty").escape()]), (0, checkUserRole_1.checkUserRoleForAction)(4), addPrefix);
module.exports = exports.router;
