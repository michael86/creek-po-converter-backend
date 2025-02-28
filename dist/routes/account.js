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
const logs_1 = require("../middleware/logs");
const express_validator_1 = require("express-validator");
const user_1 = require("../db/queries/user");
const sha256 = require("sha256");
const express = require("express");
const router = express.Router();
const handleRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let { email, password } = req.body.data;
        if (!email || !password) {
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
        if (!email || !password) {
            res.send({ status: 0 });
            return;
        }
        console.log("\x1b[31m", "--------------------------------------------------------");
        console.log("NEW LOGIN");
        console.log("\x1b[37m", "email: ", email);
        console.log("password: ", password.length);
        let user = yield (0, user_1.validateLogin)(email);
        console.log("user: ", user);
        if (!(user === null || user === void 0 ? void 0 : user.length)) {
            res.send({ status: 2 });
            return;
        }
        if (sha256(password) !== user[0]) {
            console.log("password doesn't match");
            console.log("\x1b[31m", "END LOG IN");
            console.log("\x1b[31m", "--------------------------------------------------------");
            console.log("\x1b[37m", "");
            console.log("\x1b[0m", "");
            res.send({ status: 2 });
            return;
        }
        const token = (0, tokens_1.generateToken)();
        console.log("token: ", token);
        if (!token)
            throw new Error(`Failed to generate token ${token}`);
        const tokenStored = yield (0, user_1.updateUserToken)(email, token);
        console.log("tokenStored: ", tokenStored);
        if (!tokenStored)
            throw new Error(`Failed to update user token on logging in %\n ${tokenStored}`);
        console.log("\x1b[31m", "END LOG IN");
        console.log("\x1b[31m", "--------------------------------------------------------");
        console.log("\x1b[37m", "");
        console.log("\x1b[0m", "");
        res.send({ status: 1, token, role: yield (0, user_1.getUserRole)(email) });
    }
    catch (error) {
        console.error(error);
        res.send({ status: 0 });
    }
});
const validateToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.params;
    console.log("\x1b[31m", "--------------------------------------------------------");
    console.log("\x1b[31m", "New Token Validation");
    try {
        if (!token || !email)
            throw new Error(`validate token failed ${token}`);
        console.log("Token: ", token);
        console.log("email: ", email);
        const valid = yield (0, user_1.validateUserToken)(email, token);
        console.log("valid: ", valid);
        if (!valid) {
            res.send({ valid });
            return;
        }
        console.log("\x1b[31m", "End Token Validation");
        console.log("\x1b[31m", "--------------------------------------------------------");
        res.send({ valid, role: yield (0, user_1.getUserRole)(email) });
    }
    catch (error) {
        console.error("Error validating token ", error);
        res.send({ status: 0 });
    }
});
const handleLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, email } = req.headers;
    console.log("\x1b[31m", "--------------------------------------------------------");
    console.log("\x1b[31m", "New Log Out");
    try {
        if (!token || !email)
            throw new Error(`Failed to log out user \n TOKEN: ${token}\n EMAIL: ${email}`);
        const loggedout = yield (0, user_1.setTokenToNull)(email, token);
        console.log("logged out: ", loggedout);
        if (!loggedout)
            throw new Error(`Failed to log out user ${loggedout}`);
        console.log("\x1b[31m", "End Log Out");
        console.log("\x1b[31m", "--------------------------------------------------------");
        res.send({ status: 1 });
    }
    catch (error) {
        console.error(error);
        res.send({ status: 0 });
    }
});
router.post("/register", (0, validate_1.validate)([
    (0, express_validator_1.body)("data.email").trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("data.password").trim().notEmpty(),
]), 
// addLog(""),
handleRegister);
router.post("/login", (0, validate_1.validate)([
    (0, express_validator_1.body)("data.email").trim().notEmpty().isEmail().normalizeEmail(),
    (0, express_validator_1.body)("data.password").trim().notEmpty(),
]), (0, logs_1.addLog)("login"), handleLogin);
router.get("/validate-token/:token?/:email?", (0, validate_1.validate)([
    (0, express_validator_1.param)("email")
        .trim()
        .notEmpty()
        .withMessage("email empty")
        .isEmail()
        .withMessage("Not valid email")
        .normalizeEmail(),
]), (0, logs_1.addLog)("validateToken"), validateToken);
router.post("/logout", (0, logs_1.addLog)("logout"), handleLogout);
module.exports = router;
