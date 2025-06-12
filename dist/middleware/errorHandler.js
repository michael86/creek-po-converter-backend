"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
function errorHandler(err, req, res, next) {
    console.error("An error occurred:", err);
    res.status(500).json({ error: "Internal Server Error" });
}
