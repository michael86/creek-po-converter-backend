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
exports.selectPartsReceived = exports.selectPartTotalOrdered = exports.selectPartDetails = exports.selectPartRelations = exports.selectOrderReference = exports.selectPurchaseOrderId = void 0;
const connection_1 = require("../../connection");
const selectPurchaseOrderId = (purchaseOrder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let poId = yield (0, connection_1.runQuery)(`SELECT id FROM purchase_order WHERE purchase_order = ?`, [purchaseOrder]);
        if ("code" in poId)
            throw new Error(`Failed to select purchase order id for ${purchaseOrder} \n${poId.message} `);
        return poId[0].id;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPurchaseOrderId = selectPurchaseOrderId;
const selectOrderReference = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refId = yield (0, connection_1.runQuery)(`SELECT order_reference FROM po_or WHERE purchase_order = ?`, [id]);
        if ("code" in refId)
            throw new Error(`Failed to select order reference for ${id} \n${refId.message}`);
        const orderRef = yield (0, connection_1.runQuery)(`SELECT order_reference FROM order_reference WHERE id = ?`, [refId[0].order_reference]);
        if ("code" in orderRef)
            throw new Error(`Failed to select order refence from order refence, id was ${id} \n${orderRef.message}`);
        return orderRef[0].order_reference;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectOrderReference = selectOrderReference;
const selectPartRelations = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partNumberRelations = yield (0, connection_1.runQuery)(`SELECT part_number FROM po_pn WHERE purchase_order = ? `, [id]);
        if ("code" in partNumberRelations)
            throw new Error(`Failed to select partNumberRelations ${partNumberRelations.message}`);
        return partNumberRelations;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartRelations = selectPartRelations;
const selectPartDetails = (partNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const details = yield (0, connection_1.runQuery)(`select part as name, description, partial_delivery from part_number where id = ?`, partNumber);
        if ("code" in details)
            throw new Error(`Failed to select part details ${details.message}`);
        return Object.assign({}, details[0]);
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartDetails = selectPartDetails;
const selectPartTotalOrdered = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const countRelation = yield (0, connection_1.runQuery)(`select count from pn_count where part_number = ?`, id);
        if ("code" in countRelation)
            throw new Error(`Failed to select part total ordered for ${id} \n${countRelation.message}`);
        const qty = yield (0, connection_1.runQuery)(`SELECT quantity FROM total_ordered WHERE id = ?`, [countRelation[0].count]);
        if ("code" in qty)
            throw new Error(`Error selecing total ordered for ${countRelation[0].count} \n${qty.message}`);
        return qty[0].quantity;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartTotalOrdered = selectPartTotalOrdered;
const selectPartsReceived = (partNumber) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receviedRelations = yield (0, connection_1.runQuery)(`select amount_received as amountReceived from pn_received where part_number = ?`, partNumber);
        if ("code" in receviedRelations)
            throw new Error(`Failed to select partsReceived ${receviedRelations.message}`);
        if (!receviedRelations.length)
            return [];
        const retval = [];
        for (const { amountReceived } of receviedRelations) {
            const total = yield (0, connection_1.runQuery)(`select amount_received as amountRecieved from amount_received where id = ?`, amountReceived);
            if ("code" in total)
                throw new Error(`failed to select amount received ${total.message}`);
            retval.push(+total[0].amountReceived);
        }
        return retval;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartsReceived = selectPartsReceived;
