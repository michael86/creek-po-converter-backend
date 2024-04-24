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
exports.selectLocationForPart = exports.insertLocation = exports.selectLocationId = exports.selectLocationIdForPart = void 0;
const connection_1 = require("../connection");
const selectLocationIdForPart = (order, part) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const location = yield (0, connection_1.runQuery)(`SELECT location FROM po_pn_location WHERE purchase_order = ? AND part_number = ?`, [order, part]);
        if ("code" in location)
            throw new Error(`Failed to select location id for order: ${order} \nPart: ${part}`);
        return +((_a = location[0]) === null || _a === void 0 ? void 0 : _a.location);
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectLocationIdForPart = selectLocationIdForPart;
const selectLocationId = (location) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, connection_1.runQuery)(`SELECT id FROM locations WHERE location = ?`, location);
        if ("code" in id)
            throw new Error(`Failed to select location id for ${location} \n${id.message}`);
        return +id[0].id;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectLocationId = selectLocationId;
const insertLocation = (purchaseId, partId, location, query) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //DO NOT SWITCH THE QUERY VARS ORDER!!!!!
        const inserted = yield (0, connection_1.runQuery)(query, [location, purchaseId, partId]);
        if ("code" in inserted)
            throw new Error(`Failed to insert id relation for ${purchaseId} \nError: ${inserted.message}`);
        return inserted.affectedRows;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertLocation = insertLocation;
const selectLocationForPart = (poId, pnId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const locationId = yield (0, exports.selectLocationIdForPart)(poId, pnId);
        if (!locationId)
            return;
        const location = yield (0, connection_1.runQuery)(`SELECT location FROM locations WHERE id = ?`, locationId);
        if ("code" in location)
            throw new Error(`Couldn't find location for location id ${locationId} \n${location.message}`);
        return location[0].location;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectLocationForPart = selectLocationForPart;
