"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const generateToken = () => {
    const letters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let token = "";
    for (let i = 0; i < 32; i++) {
        token += letters[Math.floor(Math.random() * letters.length)];
    }
    return token + Date.now();
};
exports.generateToken = generateToken;
