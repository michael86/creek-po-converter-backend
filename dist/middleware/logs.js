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
exports.addLog = void 0;
const user_1 = require("../db/queries/user");
const logs_1 = require("../db/queries/logs");
const utils_1 = require("../utils");
function addLog(log) {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            let { email } = req.headers;
            if (!email || !email.length) {
                email = req.body.email || req.body.data.email;
            }
            if (!email)
                return res.status(400).send();
            const userId = yield (0, user_1.getUserId)(email);
            if (!userId)
                return res.status(400).send();
            let message = "";
            switch (log) {
                case "login":
                    message = "User logged in";
                case "logout":
                    message = "User logged out";
                case "validateToken":
                    message = "User validated there token";
                    break;
                case "updateLocation":
                    let { line, location } = req.body;
                    line = (0, utils_1.sanitizeToHtmlEntities)(line);
                    location = (0, utils_1.sanitizeToHtmlEntities)(location);
                    message = `user updated location for line ${line} to ${location}`;
                    break;
                case "isPrefixValid":
                    const { prefix } = req.params;
                    message = `User checked if ${(0, utils_1.sanitizeToHtmlEntities)(prefix)} was valid`;
                    break;
                case "addPrefix":
                    const p = req.body.prefix;
                    message = `User added prefix ${(0, utils_1.sanitizeToHtmlEntities)(p)}`;
                    break;
                case "fileUpload":
                    const filename = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
                    if (!filename)
                        return res.status(400).send();
                    message = `user uploaded file ${(0, utils_1.sanitizeToHtmlEntities)(filename)}`;
                    break;
                case "fetchPo":
                    const { id } = req.params;
                    message = id
                        ? `user viewed purchase order ${(0, utils_1.sanitizeToHtmlEntities)(id)}`
                        : "User viewed all purchase order names ";
                    break;
                case "setPartial":
                    const { index } = req.params;
                    message = `user set line ${(0, utils_1.sanitizeToHtmlEntities)(index)} to partial delivery `;
                    break;
                case "addParcel":
                    const { parcels, purchaseOrder, part: pa } = req.body;
                    const total = parcels.reduce((a, b) => +a + +b, 0);
                    message = `User booked in ${total} units for ${(0, utils_1.sanitizeToHtmlEntities)(pa)} in purchase or ${(0, utils_1.sanitizeToHtmlEntities)(purchaseOrder)}`;
                    break;
                default:
                    break;
            }
            const rel = yield (0, logs_1.insertNewLog)(userId, email, message);
            if (!rel)
                return res.status(400).send();
            next();
        });
    };
}
exports.addLog = addLog;
