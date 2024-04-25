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
exports.insertNewLog = void 0;
const connection_1 = require("../connection");
const insertNewLog = (userId, email, message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const logId = yield (0, connection_1.runQuery)(`INSERT INTO logs (log, user) VALUES (?, ?)`, [
            message,
            email,
        ]);
        if ("code" in logId)
            throw new Error(`Failed to insert new log \nEmail: ${email} \nMessage: ${message}`);
        const relation = yield (0, connection_1.runQuery)(`INSERT INTO user_log (user, action) VALUES (?,?)`, [userId, logId.insertId]);
        if ("code" in relation)
            throw new Error(`Failed to create new log relation ${relation.message}`);
        return relation.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertNewLog = insertNewLog;
