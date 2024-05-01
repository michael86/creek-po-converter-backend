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
            const quantity = yield (0, utils_1.insertTotalOrdered)(part[1], poId, partId);
            if (!quantity)
                throw new Error(`Failed to insert part quantity ${part}`);
            const partial = yield (0, utils_1.insertPartToPartial)(poId, partId);
            if (!partial)
                throw new Error(`Failed to insert partial ${partial}`);
            const due = yield (0, utils_1.insertDateDue)(poId, partId, part[3]);
            if (!due)
                throw new Error(`Failed to insert due date ${due}`);
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
        const dateCreated = yield (0, utils_1.selectPurchaseOrderDate)(poId);
        if (!dateCreated)
            throw new Error(`Failed to select date for ${id} \n${dateCreated}`);
        const orderRef = yield (0, utils_1.selectOrderReference)(poId);
        if (!orderRef)
            throw new Error(`Failed to select order ref for id ${id} \n${orderRef}`);
        const partRelations = yield (0, utils_1.selectPartRelations)(poId);
        if (!partRelations)
            throw new Error(`Failed to select part relations for id ${id} \n${partRelations}`);
        const retval = {
            dateCreated,
            purchaseOrder: id,
            orderRef: orderRef,
            partNumbers: {},
        };
        //Begin filling out the order part status
        for (const { part_number } of partRelations) {
            //Select details such as description, partial order and so on
            const part = yield (0, utils_1.selectPartDetails)(+part_number);
            if (!part)
                throw new Error(`Failed to select part details for ${id} \n${part}`);
            //Select the total amount ordered
            const totalOrdered = yield (0, utils_1.selectPartTotalOrdered)(poId, +part_number);
            if (!totalOrdered)
                throw new Error(`Failed to select total ordered for ${id} \n${totalOrdered}`);
            //Select if partial
            const partial = yield (0, utils_1.selectPartPartialStatus)(poId, +part_number);
            if (typeof partial !== "number")
                throw new Error(`Failed to select part partial status for ${id} \n${partial}`);
            //Select Location
            const location = yield (0, locations_1.selectLocationForPart)(poId, +part_number);
            //Select any orders for this part
            const partsReceived = yield (0, utils_1.selectPartsReceived)(+part_number, poId);
            retval.partNumbers[part.name] = {
                name: part.name,
                totalOrdered: +totalOrdered,
                partial: partial,
                description: part.description,
                partsReceived,
                location,
            };
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
const patchPartialStatus = (order, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, utils_1.selectPurchaseOrderId)(order);
        if (!id)
            throw new Error(`Failed to select id for purchase order ${order}`);
        const partId = yield (0, utils_1.selectPartId)(name);
        if (!partId)
            throw new Error(`Failed to fetch part id ${name}`);
        const res = yield (0, utils_1.setPartialStatus)(id, partId);
        if (!res)
            throw new Error(`Failed to set partial_delivery to 1 for id ${res}`);
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
const addParcelsToOrder = (parcels, purchaseOrder, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poId = yield (0, utils_1.selectPurchaseOrderId)(purchaseOrder);
        if (!poId)
            throw new Error(`Failed to select if for purchase order: ${purchaseOrder}`);
        const partId = yield (0, utils_1.selectPartId)(part);
        if (!partId)
            throw new Error(`Failed to select partId for order: ${part}`);
        for (const parcel of parcels) {
            const parcelId = yield (0, utils_1.addParcel)(parcel);
            if (!parcelId)
                throw new Error(`Failed to insert parcel ${parcelId}`);
            const relation = yield (0, utils_1.insertParcelRelation)(poId, partId, parcelId);
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
