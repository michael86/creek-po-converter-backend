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
exports.deleteAmountReceived = exports.deletePartialStatus = exports.deleteTotalOrdered = exports.deleteOrderPartLocation = exports.selectPurchaseOrderDate = exports.insertParcelRelation = exports.addParcel = exports.setPartialStatus = exports.selectPartPartialStatus = exports.insertDateDue = exports.insertPartToPartial = exports.insertTotalOrdered = exports.insertPartNumber = exports.selectPartId = exports.insertOrderRef = exports.insertPurchaseOrder = exports.selectPartsReceivedIds = exports.selectDateDue = exports.selectPartsReceived = exports.selectPartTotalOrderedId = exports.selectPartTotalOrdered = exports.selectPartDetails = exports.selectPartRelations = exports.selectOrderReference = exports.selectPurchaseOrderId = void 0;
const connection_1 = require("../../connection");
const selectPurchaseOrderId = (purchaseOrder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let poId = yield (0, connection_1.runQuery)(`SELECT id FROM purchase_order WHERE purchase_order = ?`, [purchaseOrder]);
        if ("code" in poId)
            throw new Error(`Failed to select purchase order id for ${purchaseOrder} \n${poId.message} `);
        return +poId[0].id;
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
        const partNumberRelations = yield (0, connection_1.runQuery)(`SELECT part_number FROM po_pn_ordered WHERE purchase_order = ? `, [id]);
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
        const details = yield (0, connection_1.runQuery)(`select part as name, description from part_number where id = ?`, partNumber);
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
const selectPartTotalOrdered = (poId, pnId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const relation = yield (0, exports.selectPartTotalOrderedId)(poId, pnId);
        if (!relation)
            return;
        const qty = yield (0, connection_1.runQuery)(`SELECT quantity FROM total_ordered WHERE id = ?`, [relation]);
        if ("code" in qty)
            throw new Error(`Error selecing total ordered for purchase order: ${poId}  \npart number: ${pnId} \n${qty.message}`);
        return qty[0].quantity;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartTotalOrdered = selectPartTotalOrdered;
const selectPartTotalOrderedId = (order, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, connection_1.runQuery)(`select total_ordered from po_pn_ordered where purchase_order = ? AND part_number = ?`, [order, part]);
        if ("code" in id)
            throw new Error(`Failed to select part total ordered for purchase order: ${order}  \npart number: ${part} \n${id.message}`);
        return id[0].total_ordered;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartTotalOrderedId = selectPartTotalOrderedId;
const selectPartsReceived = (partNumber, purchaseOrder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receivedRelations = yield (0, exports.selectPartsReceivedIds)(purchaseOrder, partNumber);
        if (!receivedRelations)
            return [];
        const retval = [];
        for (const { parcel } of receivedRelations) {
            const total = yield (0, connection_1.runQuery)(`SELECT amount_received as amountReceived, UNIX_TIMESTAMP(date_created) as dateReceived FROM amount_received WHERE id = ?`, parcel);
            if ("code" in total)
                throw new Error(`failed to select amount received ${total.message}`);
            if (!total[0])
                return;
            retval.push({
                amountReceived: +total[0].amountReceived,
                dateReceived: +total[0].dateReceived,
            });
        }
        return retval;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartsReceived = selectPartsReceived;
const selectDateDue = (partNumber, purchaseOrder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dueDateRelation = yield (0, connection_1.runQuery)(`SELECT due_date FROM po_pn_due WHERE purchase_order = ? AND part_number = ?`, [purchaseOrder, partNumber]);
        if ("code" in dueDateRelation)
            throw new Error(`Error selecting due date relation for order: ${purchaseOrder} \nPart: ${partNumber} \n${dueDateRelation.message}`);
        const dueDate = yield (0, connection_1.runQuery)(`SELECT date_due as dateDue from date_due WHERE id = ? `, [dueDateRelation[0].due_date]);
        if ("code" in dueDate)
            throw new Error(`Failed to select due date ${dueDate.message}`);
        return dueDate[0].dateDue;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectDateDue = selectDateDue;
const selectPartsReceivedIds = (order, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const receivedRelations = yield (0, connection_1.runQuery)(`select parcel from po_pn_parcel where purchase_order = ? AND part_number = ?`, [order, part]);
        if ("code" in receivedRelations)
            throw new Error(`Failed to select partsReceived ${receivedRelations.message}`);
        if (!receivedRelations.length)
            return;
        return receivedRelations;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartsReceivedIds = selectPartsReceivedIds;
const insertPurchaseOrder = (po) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchase = yield (0, connection_1.runQuery)(`insert into purchase_order (purchase_order) values (?)`, po);
        if ("code" in purchase) {
            if (purchase.code === "ER_DUP_ENTRY") {
                return purchase.code;
            }
            throw new Error(`error inserting purchase_order \n${purchase}`);
        }
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
        return +id[0].id;
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
const insertPartToPartial = (purchase, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partial = yield (0, connection_1.runQuery)(`INSERT INTO po_pn_partial (purchase_order, part_number) VALUES (?, ?);`, [purchase, part]);
        if ("code" in partial)
            throw new Error(`Failed to insert part ${part} into partial for order ${purchase}`);
        return partial.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertPartToPartial = insertPartToPartial;
const insertDateDue = (purchase, part, due) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`INSERT INTO date_due (date_due) VALUES (STR_TO_DATE(?, '%d/%m/%Y'))`, [due]);
        if ("code" in res)
            throw new Error(`Failed to insert due date \n${res.message}`);
        const relation = yield (0, connection_1.runQuery)(`INSERT INTO po_pn_due (purchase_order, part_number, due_date) VALUES (?,?, ?)`, [purchase, part, res.insertId]);
        if ("code" in relation)
            throw new Error(`Failed to insert due date relation \n${relation.message}`);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertDateDue = insertDateDue;
const selectPartPartialStatus = (poId, pnId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const partial = yield (0, connection_1.runQuery)(`SELECT partial FROM po_pn_partial WHERE purchase_order = ? AND part_number = ?`, [poId, pnId]);
        if ("code" in partial)
            throw new Error(`Failed to select partial status for purchase order: ${poId} \nPart Number: ${pnId}`);
        return partial[0].partial;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPartPartialStatus = selectPartPartialStatus;
const setPartialStatus = (purchaseId, partId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patched = yield (0, connection_1.runQuery)(`UPDATE po_pn_partial SET partial = 1 WHERE purchase_order = ? AND part_number =? `, [purchaseId, partId]);
        if ("code" in patched || !patched.affectedRows)
            throw new Error(`Failed to update partial status for order ${purchaseId} \nPart: ${partId} \n${patched}`);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.setPartialStatus = setPartialStatus;
const addParcel = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`insert into amount_received (amount_received) values (?)`, [amount]);
        if ("code" in res)
            throw new Error(`Failed to insert new parcel ${res.message}`);
        return res.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.addParcel = addParcel;
const insertParcelRelation = (poId, pnId, parcelId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`INSERT INTO po_pn_parcel (purchase_order, part_number, parcel) VALUES (?,?,?)`, [poId, pnId, parcelId]);
        if ("code" in res)
            throw new Error(`Failed to create new relation for parcel ${res.message}`);
        return res.insertId;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertParcelRelation = insertParcelRelation;
const selectPurchaseOrderDate = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`SELECT UNIX_TIMESTAMP(date_created) as dateCreated from purchase_order WHERE id = ?`, [id]);
        if ("code" in res || !res[0])
            throw new Error(`Failed to create new relation for parcel ${"code" in res ? res.message : res}`);
        return res[0].dateCreated;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.selectPurchaseOrderDate = selectPurchaseOrderDate;
const deleteOrderPartLocation = (order, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`DELETE FROM po_pn_location WHERE purchase_order = ? AND part_number = ?`, [order, part]);
        if ("code" in res)
            throw new Error(`Error deleting part location from purchase order: ${order} \npart: ${part} \n${res.message}`);
        return res.affectedRows;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.deleteOrderPartLocation = deleteOrderPartLocation;
const deleteTotalOrdered = (id, order, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`DELETE FROM total_ordered WHERE id = ?`, [id]);
        if ("code" in res)
            throw new Error(`Failed to delete total ordered for id${id} \n${res.message}`);
        const relationRes = yield (0, connection_1.runQuery)(`DELETE FROM po_pn_ordered WHERE purchase_order = ? AND part_number = ?`, [order, part]);
        if ("code" in relationRes)
            throw new Error(`Failed to delete total ordered relation for id${id} \n${relationRes.message}`);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.deleteTotalOrdered = deleteTotalOrdered;
const deletePartialStatus = (order, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const res = yield (0, connection_1.runQuery)(`DELETE FROM po_pn_partial WHERE purchase_order = ? AND part_number = ?`, [order, part]);
        if ("code" in res)
            throw new Error(`Error deleting partial status for order: ${order} \npart: ${part} \n${res.message}`);
        return res.affectedRows;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.deletePartialStatus = deletePartialStatus;
const deleteAmountReceived = (parcelIds, order, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const { parcel } of parcelIds) {
            const res = yield (0, connection_1.runQuery)(`DELETE FROM amount_received WHERE id = ?`, [+parcel]);
            if ("code" in res)
                throw new Error(`Error deleting amount received id: ${parcel} \n${res.message}`);
        }
        const res = yield (0, connection_1.runQuery)(`DELETE FROM po_pn_parcel WHERE purchase_order = ? AND part_number = ?`, [order, part]);
        if ("code" in res)
            throw new Error(`Error deleting amount received relation order: ${order} part: ${part} \n${res.message}`);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.deleteAmountReceived = deleteAmountReceived;
