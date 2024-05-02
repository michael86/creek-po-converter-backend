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
exports.removePartFromOrder = exports.addParcelsToOrder = exports.patchPartialStatus = exports.fetchPurchaseOrder = exports.fetchPurchaseOrders = exports.insertOrderToDb = void 0;
const connection_1 = require("../connection");
const utils_1 = require("./utils");
const locations_1 = require("./locations");
/**
 *
 * Will insert the data extracted from a purchase order into the database
 *
 * @param data PDFstructure
 * @returns
 */
const insertOrderToDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poId = yield (0, utils_1.insertPurchaseOrder)(data.PURCHASE_ORDER);
        if (!poId)
            throw new Error(`Failed to insert purchase order ${data} \n${poId}`);
        if (poId === "ER_DUP_ENTRY")
            return poId;
        const orId = yield (0, utils_1.insertOrderRef)(data.ORDER_REFERENCE, poId);
        if (!orId)
            throw new Error(`Failed to insert purchase order ${data} \n${orId}`);
        for (const part of data.DATA) {
            const partId = yield (0, utils_1.insertPartNumber)(part);
            if (!partId)
                throw new Error(`Failed to insert part ${part[0]} \n${partId}`);
            const quantityId = yield (0, utils_1.insertTotalOrdered)(part[1]);
            if (!quantityId)
                throw new Error(`Failed to insert part quantity ${part}`);
            const partialId = yield (0, utils_1.insertPartToPartial)();
            if (!partialId)
                throw new Error(`Failed to insert partial ${partialId}`);
            const dueId = yield (0, utils_1.insertDateDue)(part[3]);
            if (!dueId)
                throw new Error(`Failed to insert due date ${dueId}`);
            const descId = yield (0, utils_1.insertDescription)(part[2]);
            if (!descId)
                throw new Error(`Failed to insert new description \n${descId}`);
            const lineId = yield (0, utils_1.createLineRelation)(partId, descId, quantityId, dueId, partialId);
            if (!lineId)
                throw new Error(`Failed to insert create line relation ${lineId}`);
            const orderRelation = yield (0, utils_1.insertOrderLineRelation)(poId, lineId);
            if (!orderRelation)
                throw new Error(`Failed to insert create line relation ${orderRelation}`);
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.insertOrderToDb = insertOrderToDb;
/**
 * Will return an array of all the purchase orders
 * @returns string[]
 */
const fetchPurchaseOrders = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, connection_1.runQuery)(`SELECT purchase_order as purchaseOrder FROM purchase_order`, []);
        if ("code" in data)
            throw new Error(`Failed to fetchPurchaseOrder ${data.message}`);
        return data.map((p) => p.purchaseOrder);
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.fetchPurchaseOrders = fetchPurchaseOrders;
/**
 * Will return a specific purchase order based on the purchase order name
 * @param id - typically the purchase order name
 * @returns PurchaseOrder | void
 */
const fetchPurchaseOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poId = yield (0, utils_1.selectPurchaseOrderId)(id);
        if (!poId)
            throw new Error(`Failed to select purchase order id for ${id} \n${poId}`);
        const orderRef = yield (0, utils_1.selectOrderReference)(poId);
        if (!orderRef)
            throw new Error(`Failed to select order ref for id ${id} \n${orderRef}`);
        const dateCreated = yield (0, utils_1.selectPurchaseOrderDate)(poId);
        if (!dateCreated)
            throw new Error(`Failed to select date for ${id} \n${dateCreated}`);
        const lines = yield (0, utils_1.selectPoLines)(poId);
        if (!lines)
            throw new Error(`No lines for purchase order: ${poId}`);
        const retval = {
            dateCreated,
            purchaseOrder: id,
            orderRef: orderRef,
            partNumbers: [],
        };
        for (const { line } of lines) {
            const lineRelations = yield (0, utils_1.selectLineRelations)(line);
            if (!lineRelations)
                throw new Error(`Error selecting line relations for order: ${id} and line: ${line}`);
            const part = yield (0, utils_1.selectPartDetails)(lineRelations.partId);
            if (!part)
                throw new Error(`failed to select part name`);
            const dateDue = yield (0, utils_1.selectDateDue)(lineRelations.dueDateId);
            if (!dateDue)
                throw new Error(`failed to select date due`);
            const totalOrdered = yield (0, utils_1.selectPartTotalOrdered)(lineRelations.totalOrderedId);
            if (!totalOrdered)
                throw new Error(`failed to select total ordered`);
            const partial = yield (0, utils_1.selectPartPartialStatus)(lineRelations.partialId);
            if (typeof partial !== "number")
                throw new Error(`Failed to select partial`);
            const description = yield (0, utils_1.selectDescription)(lineRelations.descId);
            if (!description)
                throw new Error(`Failed to select description`);
            const location = lineRelations.locationId !== null
                ? yield (0, locations_1.selectLocation)(lineRelations.locationId)
                : lineRelations.locationId;
            const partsReceviedIds = yield (0, utils_1.selectPartsReceivedIds)(line);
            retval.partNumbers.push({
                name: part.name,
                dateDue,
                totalOrdered,
                partial: partial,
                description,
                partsReceived: !(partsReceviedIds === null || partsReceviedIds === void 0 ? void 0 : partsReceviedIds.length) ? [] : yield (0, utils_1.selectPartsReceived)(partsReceviedIds),
                location,
                lineId: line,
            });
        }
        return retval;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.fetchPurchaseOrder = fetchPurchaseOrder;
/**
 *
 * Will udpate a parts status surrounding partial status
 *
 * @param order string - purchase order name
 * @param name stirng - partnumber
 * @returns
 */
const patchPartialStatus = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("id ", id);
        const res = yield (0, connection_1.runQuery)(`SELECT partial_id as partialId FROM \`lines\` WHERE id = ?`, [id]);
        if ("code" in res)
            throw new Error(`Failed to select partial_id from lines ${res.message}`);
        console.log(res);
        yield (0, utils_1.setPartialStatus)(res[0].partialId);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.patchPartialStatus = patchPartialStatus;
/**
 *
 * Will add new parcels to a selected purchase orders part number
 *
 * @param parcels number[]
 * @param purchaseOrder string
 * @param part string
 * @returns true | void
 */
const addParcelsToOrder = (parcels, index) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        for (const parcel of parcels) {
            const parcelId = yield (0, utils_1.addParcel)(parcel);
            if (!parcelId)
                throw new Error(`Failed to insert parcel ${parcelId}`);
            const relation = yield (0, utils_1.insertParcelRelation)(index, parcelId);
            if (!relation)
                throw new Error(`Failed to insert parcel relation ${relation}`);
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.addParcelsToOrder = addParcelsToOrder;
const removePartFromOrder = (order, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = yield (0, utils_1.selectPurchaseOrderId)(order);
        if (!orderId)
            return;
        const partId = yield (0, utils_1.selectPartId)(part);
        if (!partId)
            return;
        const totalOrderedId = yield (0, utils_1.selectPartTotalOrderedId)(orderId, partId);
        if (!totalOrderedId)
            return;
        yield (0, utils_1.deleteTotalOrdered)(Number(totalOrderedId), orderId, partId);
        yield (0, utils_1.deletePartialStatus)(orderId, partId);
        yield (0, utils_1.deleteOrderPartLocation)(orderId, partId); //Dont check if deleted as location may not be assigned so no rows affected
        const parcelIds = yield (0, utils_1.selectPartsReceivedIds)(orderId, partId);
        if (!(parcelIds === null || parcelIds === void 0 ? void 0 : parcelIds.length))
            return true;
        const deletedParcels = yield (0, utils_1.deleteAmountReceived)(parcelIds, orderId, partId);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.removePartFromOrder = removePartFromOrder;
