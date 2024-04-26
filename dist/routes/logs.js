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
const logs_1 = require("../db/queries/logs");
const checkUserRole_1 = require("../middleware/checkUserRole");
const express = require("express");
const router = express.Router();
const returnLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logs = yield (0, logs_1.selectLogs)();
        if (!(logs === null || logs === void 0 ? void 0 : logs.length))
            res.status(500).send({ token: req.headers.newToken });
        res.send({ token: req.headers.newToken, logs });
    }
    catch (error) {
        console.error(error);
        res.status(500).send({ token: req.headers.newToken });
    }
});
router.get("/", (0, checkUserRole_1.checkUserRoleForAction)(5), returnLogs);
module.exports = router;
