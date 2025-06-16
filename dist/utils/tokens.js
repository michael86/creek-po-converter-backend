"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setJwtCookie = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isProduction = process.env.NODE_ENV === "production";
console.log(isProduction);
const generateToken = (payload) => jsonwebtoken_1.default.sign(payload, process.env.JWT_KEY, { expiresIn: 60 * 60 * 6 });
exports.generateToken = generateToken;
const setJwtCookie = (res, token) => {
    res.cookie("authCookie", token, {
        maxAge: 1000 * 60 * 60 * 6, // 6 hours
        httpOnly: true,
        secure: isProduction, // False in development (localhost is HTTP)
        sameSite: isProduction ? "none" : "lax", // "lax" allows cross-site on HTTP localhost
        path: "/",
    });
};
exports.setJwtCookie = setJwtCookie;
