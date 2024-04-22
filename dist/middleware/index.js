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
exports.validateToken = void 0;
const tokens_1 = require("../utils/tokens");
const user_1 = require("../db/queries/user");
const validateToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (shouldSkipValidation(req.path) || req.path.includes("validate-token")) {
        return next();
    }
    try {
        const { email, token } = req.headers;
        if (!email || !token) {
            return res.status(400).send({ error: "Email or token missing" });
        }
        const valid = yield (0, user_1.validateUserToken)(email, token);
        if (!valid) {
            console.error("Token validation failed: Invalid token or email");
            return res.status(400).send({ error: "Token validation failed" });
        }
        const newToken = (0, tokens_1.generateToken)();
        const updated = yield (0, user_1.updateUserToken)(email, newToken);
        if (!updated) {
            console.error("Failed to update user token in middleware");
            return res.status(500).send({ error: "Failed to update user token" });
        }
        req.headers.newToken = newToken;
        next();
    }
    catch (error) {
        console.error("Token validation error:", error);
        res.status(500).send({ error: "Internal server error" });
    }
});
exports.validateToken = validateToken;
function shouldSkipValidation(path) {
    const skipPaths = ["/login", "/register"];
    return skipPaths.includes(path);
}
