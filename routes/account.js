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
const { selectEmail, createUser, validateLogin, validateUserToken, setTokenToNull, updateUserToken, } = require("../sql/queries");
const tokens_1 = require("../utils/tokens");
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
        res.send({ status: 1, token: userCreated });
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
            console.log("not valid");
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
        const token = (0, tokens_1.generateToken)();
        if (!token)
            throw new Error(`Failed to generate token ${token}`);
        const tokenStored = yield updateUserToken(email, token);
        if (!tokenStored)
            throw new Error(`Failed to update user token on logging in %\n ${tokenStored}`);
        res.send({ status: 1, token });
    }
    catch (error) {
        console.log("Log in error ", error);
        res.send({ status: 0 });
    }
}));
router.get("/validate-token/:token?/:email?", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.params;
    try {
        if (!token || !email)
            throw new Error(`validate token failed ${token}`);
        res.send({ valid: yield validateUserToken(email, token) });
    }
    catch (error) {
        console.log("Error validating token ", error);
        res.send({ status: 0 });
    }
}));
router.post("/logout", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.body;
    try {
        if (!token || !email)
            throw new Error(`Failed to log out user \n TOKEN: ${token}\n EMAIL: ${email}`);
        const loggedout = yield setTokenToNull(token);
        if (!loggedout)
            throw new Error(`Failed to log out user ${loggedout}`);
        res.send({ status: 1 });
    }
    catch (error) {
        console.log(error);
        res.send({ status: 0 });
    }
}));
module.exports = router;
