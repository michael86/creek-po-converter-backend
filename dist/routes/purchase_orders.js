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
const { patchPartialStatus } = require("../sql/queries");
const express = require("express");
const router = express.Router();
const updatePartNumber = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { order, name } = req.params;
        const result = yield patchPartialStatus(order, name);
        if (!result)
            throw new Error(result);
        res.send({ status: 1, token: req.headers.newToken });
    }
    catch (error) {
        console.error(`error setting part_number to partial parcel: ${error}`);
        res.status(500).send({ status: 0 });
    }
});
router.patch("/set-partial/:order?/:name?", updatePartNumber);
module.exports = router;
