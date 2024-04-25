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
exports.checkUserRoleForAction = void 0;
const user_1 = require("../db/queries/user");
const checkUserRoleForAction = (action) => {
    return function (req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email } = req.headers;
            if (!email)
                return res.status(400).send();
            const userRole = yield (0, user_1.getUserRole)(email);
            if (!userRole)
                return res.status(500).send();
            if (userRole >= action) {
                next();
                return;
            }
            res.status(500).send;
        });
    };
};
exports.checkUserRoleForAction = checkUserRoleForAction;
