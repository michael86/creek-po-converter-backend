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
const { selectEmail, createUser, validateLogin } = require("../sql/queries");
const sha256 = require("sha256");
const express = require("express");
const router = express.Router();
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body.data;
        if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
            res.send({ status: 0 });
            return;
        }
        const emailUsed = yield selectEmail(email);
        if (emailUsed) {
            res.send({ status: 2 });
            return;
        }
        password = sha256(password);
        const userCreated = yield createUser(email, password);
        if (!userCreated)
            throw new Error(`createUser: ${userCreated}`);
        res.send({ status: 1 });
    }
    catch (error) {
        console.log("registration error ", error);
        res.send({ status: 0 });
    }
}));
router.post("/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body.data;
        if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
            res.send({ status: 0 });
            return;
        }
        let user = yield validateLogin(email);
        if (!user.length) {
            res.send({ status: 2 });
            return;
        }
        user = user[0];
        if (sha256(password) !== user.password) {
            res.send({ status: 2 });
            return;
        }
        res.send({ status: 1 });
    }
    catch (error) {
        console.log("Log in error ", error);
        res.send({ status: 0 });
    }
}));
module.exports = router;
