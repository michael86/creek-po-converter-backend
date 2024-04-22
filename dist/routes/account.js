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
const tokens_1 = require("../utils/tokens");
const validate_1 = require("../middleware/validate");
const express_validator_1 = require("express-validator");
const user_1 = require("../db/queries/user");
const sha256 = require("sha256");
const express = require("express");
const router = express.Router();
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body.data;
        if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
            res.send({ status: 0 });
            return;
        }
        const emailUsed = yield (0, user_1.selectEmail)(email);
        if (emailUsed) {
            res.send({ status: 2 });
            return;
        }
        password = sha256(password);
        const userCreated = yield (0, user_1.createUser)(email, password);
        if (!userCreated)
            throw new Error(`createUser: ${userCreated}`);
        res.send({ status: 1, token: userCreated });
    }
    catch (error) {
        console.error("registration error ", error);
        res.send({ status: 0 });
    }
});
const handleLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body.data;
        if (!email || !password || !email.includes("@creekviewelectronics.co.uk")) {
            res.send({ status: 0 });
            return;
        }
        let user = yield (0, user_1.validateLogin)(email);
        if (!(user === null || user === void 0 ? void 0 : user.length)) {
            res.send({ status: 2 });
            return;
        }
        if (sha256(password) !== user[0]) {
            res.send({ status: 2 });
            return;
        }
        const token = (0, tokens_1.generateToken)();
        if (!token)
            throw new Error(`Failed to generate token ${token}`);
        const tokenStored = yield (0, user_1.updateUserToken)(email, token);
        if (!tokenStored)
            throw new Error(`Failed to update user token on logging in %\n ${tokenStored}`);
        res.send({ status: 1, token, role: yield (0, user_1.getUserRole)(email) });
    }
    catch (error) {
        console.error(error);
        res.send({ status: 0 });
    }
});
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.params;
    try {
        if (!token || !email)
            throw new Error(`validate token failed ${token}`);
        const valid = yield (0, user_1.validateUserToken)(email, token);
        if (!valid) {
            res.send({ valid });
            return;
        }
        res.send({ valid, role: yield (0, user_1.getUserRole)(email) });
    }
    catch (error) {
        console.error("Error validating token ", error);
        res.send({ status: 0 });
    }
});
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.headers;
    try {
        if (!token || !email)
            throw new Error(`Failed to log out user \n TOKEN: ${token}\n EMAIL: ${email}`);
        const loggedout = yield (0, user_1.setTokenToNull)(email, token);
        if (!loggedout)
            throw new Error(`Failed to log out user ${loggedout}`);
        res.send({ status: 1 });
    }
    catch (error) {
        console.error(error);
        res.send({ status: 0 });
    }
});
router.post("/register", handleRegister);
router.post("/login", handleLogin);
router.get("/validate-token/:token?/:email?", (0, validate_1.validate)([
    (0, express_validator_1.param)("email")
        .trim()
        .notEmpty()
        .withMessage("email empty")
        .isEmail()
        .withMessage("Not valid email")
        .normalizeEmail(),
]), validateToken);
router.post("/logout", handleLogout);
module.exports = router;
