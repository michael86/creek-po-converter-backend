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
exports.insertTotalOrdered = exports.insertPartNumber = exports.selectPartId = exports.insertOrderRef = exports.insertPurchaseOrder = exports.selectPartsReceived = exports.selectPartTotalOrdered = exports.selectPartDetails = exports.selectPartRelations = exports.selectOrderReference = exports.selectPurchaseOrderId = void 0;
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
        const countRelation = yield (0, connection_1.runQuery)(`select ordered from pn_ordered where part_number = ?`, id);
        if ("code" in countRelation)
            throw new Error(`Failed to select part total ordered for ${id} \n${countRelation.message}`);
        const qty = yield (0, connection_1.runQuery)(`SELECT quantity FROM total_ordered WHERE id = ?`, [countRelation[0].ordered]);
        if ("code" in qty)
            throw new Error(`Error selecing total ordered for ${countRelation[0].ordered} \n${qty.message}`);
        return qty[0].quantity;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartTotalOrdered = selectPartTotalOrdered;
const selectPartsReceived = (partNumber, purchaseOrder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receviedRelations = yield (0, connection_1.runQuery)(`select parcel from po_pn_parcel where part_number = ? AND purchase_order = ?`, [partNumber, purchaseOrder]);
        if ("code" in receviedRelations)
            throw new Error(`Failed to select partsReceived ${receviedRelations.message}`);
        if (!receviedRelations.length)
            return [];
        const retval = [];
        for (const { amountReceived } of receviedRelations) {
            const total = yield (0, connection_1.runQuery)(`select amount_received as amountReceived from amount_received where id = ?`, amountReceived);
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
const insertPurchaseOrder = (po) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchase = yield (0, connection_1.runQuery)(`insert into purchase_order (purchase_order) values (?)`, po);
        if ("code" in purchase)
            throw new Error(`error inserting purchase_order \n${purchase}`);
        return purchase.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertPurchaseOrder = insertPurchaseOrder;
const insertOrderRef = (or, po) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield (0, connection_1.runQuery)(`insert into order_reference (order_reference) values (?)`, or);
        if ("code" in order)
            throw new Error(`error inserting purchase_order \n${order}`);
        const poOrRef = yield (0, connection_1.runQuery)(`INSERT INTO po_or (purchase_order, order_reference) VALUES (?, ?);`, [po, order.insertId]);
        if ("code" in poOrRef)
            throw new Error(`Failed to insert new PO. Relation failed ${poOrRef.message}`);
        return order.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertOrderRef = insertOrderRef;
const selectPartId = (part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, connection_1.runQuery)(`SELECT id from part_number where part = ?`, part);
        if ("code" in id)
            throw new Error(`Failed to select id for part ${part}`);
        return id[0].id;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartId = selectPartId;
/**
 *
 * Will insert the part and return the insertId, if dupe entry, will return the id of that dupe entry
 *
 * @param part [name, qty, description]
 * @returns
 */
const insertPartNumber = (part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partNumber = yield (0, connection_1.runQuery)(`insert into part_number (part, description) values (?, ?)`, [part[0], part[2]]);
        if ("code" in partNumber) {
            if (partNumber.code === "ER_DUP_ENTRY") {
                const id = yield (0, exports.selectPartId)(part[0]);
                if (!id)
                    throw new Error(`Failed to find id for ${part[0]}`);
                return +id;
            }
            throw new Error(`Error inserting part, failed to insert part ${part[0]} \n${partNumber.message}`);
        }
        return partNumber.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertPartNumber = insertPartNumber;
const insertTotalOrdered = (totalOrdered, purchaseOrder, partId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const quantity = yield (0, connection_1.runQuery)(`INSERT INTO total_ordered (quantity) VALUES (?);`, totalOrdered);
        if ("code" in quantity)
            throw new Error(`Error adding purchase order, failed to insert quantity ${quantity.message}`);
        const pnCount = yield (0, connection_1.runQuery)(`INSERT INTO \`po_pn_ordered\` (purchase_order, part_number, total_ordered) VALUES (?, ?,? );`, [purchaseOrder, partId, quantity.insertId]);
        if ("code" in pnCount)
            throw new Error(`Error adding purchase order, failed to insert sku ${pnCount.message}`);
        return quantity.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertTotalOrdered = insertTotalOrdered;
