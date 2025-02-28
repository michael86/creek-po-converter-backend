"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
function errorHandler(err, req, res, next) {
    console.error("An error occurred:", err);
    if (!res.headersSent) {
        return res.status(500).json({ error: "Internal Server Error" });
    }
    // If headers were already sent, let Express handle it internally
    return next(err);
}
exports.errorHandler = errorHandler;
