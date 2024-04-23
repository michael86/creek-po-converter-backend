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
exports.addParcelsToOrder = exports.patchPartialStatus = exports.fetchPurchaseOrder = exports.fetchPurchaseOrders = exports.insertOrderToDb = void 0;
const connection_1 = require("../connection");
const utils_1 = require("./utils");
const insertOrderToDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poId = yield (0, utils_1.insertPurchaseOrder)(data.PURCHASE_ORDER);
        if (!poId)
            throw new Error(`Failed to insert purchase order ${data} \n${poId}`);
        const orId = yield (0, utils_1.insertOrderRef)(data.ORDER_REFERENCE, poId);
        if (!orId)
            throw new Error(`Failed to insert purchase order ${data} \n${orId}`);
        const skuCountIds = [];
        for (const part of data.DATA) {
            const partId = yield (0, utils_1.insertPartNumber)(part);
            if (!partId)
                throw new Error(`Failed to insert part ${part[0]} \n${partId}`);
            //Upto refactoring here
            const [quantity] = yield Promise.all([
                (0, connection_1.runQuery)(`INSERT INTO total_ordered (quantity) VALUES (?);`, [Number(part[1])]),
            ]);
            if ("code" in quantity)
                throw new Error(`Error adding purchase order, failed to insert quantity ${quantity}`);
            skuCountIds.push([partId, +quantity.insertId]);
        }
        for (const part of skuCountIds) {
            const poPart = yield (0, connection_1.runQuery)(`INSERT INTO po_pn (purchase_order, part_number) VALUES (?, ?);`, [poId, part[0]]);
            if ("code" in poPart)
                throw new Error(`Error adding purchase order, failed to insert po_or ${poPart.message}`);
        }
        for (const part of skuCountIds) {
            const pnCount = yield (0, connection_1.runQuery)(`INSERT INTO \`pn_ordered\` (part_number, ordered) VALUES (?, ?);`, [part[0], part[1]]);
            if ("code" in pnCount)
                throw new Error(`Error adding purchase order, failed to insert sku ${pnCount.message}`);
        }
        return true;
    }
    catch (error) {
        if ((error instanceof Error && error.message.includes("ER_DUP_ENTRY")) ||
            (typeof error === "string" && error.includes("ER_DUP_ENTRY"))) {
            return "ER_DUP_ENTRY";
        }
        console.error(`failed to insert data to db `, error);
        return;
    }
});
exports.insertOrderToDb = insertOrderToDb;
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
const fetchPurchaseOrder = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const poId = yield (0, utils_1.selectPurchaseOrderId)(id);
        if (!poId)
            throw new Error(`Failed to select purchase order id for ${id} \n${poId}`);
        const orderRef = yield (0, utils_1.selectOrderReference)(poId);
        if (!orderRef)
            throw new Error(`Failed to select order ref for id ${id} \n${orderRef}`);
        const partRelations = yield (0, utils_1.selectPartRelations)(poId);
        if (!partRelations)
            throw new Error(`Failed to select part relations for id ${id} \n${partRelations}`);
        const retval = {
            purchaseOrder: id,
            orderRef: orderRef,
            partNumbers: {},
        };
        //Begin filling out the order part status
        for (const relation of partRelations) {
            //Select details such as description, partial order and so on
            const part = yield (0, utils_1.selectPartDetails)(relation.part_number);
            if (!part)
                throw new Error(`Failed to select part details for ${id} \n${part}`);
            //Select the total amount ordered
            const totalOrdered = yield (0, utils_1.selectPartTotalOrdered)(relation.part_number);
            if (!totalOrdered)
                throw new Error(`Failed to select total ordered for ${id} \n${totalOrdered}`);
            const partsReceived = yield (0, utils_1.selectPartsReceived)(relation.part_number, poId);
            retval.partNumbers[part.name] = {
                name: part.name,
                totalOrdered: +totalOrdered,
                partial: +part.partial_delivery,
                description: part.description,
                partsReceived,
            };
        }
        return {
            purchaseOrder: id,
            orderRef: orderRef,
            partNumbers: retval.partNumbers,
        };
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.fetchPurchaseOrder = fetchPurchaseOrder;
const patchPartialStatus = (order, name) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = yield (0, connection_1.runQuery)(`SELECT id from purchase_order WHERE purchase_order = ?`, [order]);
        if ("code" in id)
            throw new Error(`Failed to select id for purchase order ${id.message}`);
        const partIds = yield (0, connection_1.runQuery)(`SELECT id, part as name from part_number WHERE part = ?`, [name]);
        if ("code" in partIds)
            throw new Error(`Failed to fetch partIds ${partIds.message}`);
        let target;
        for (const part of partIds) {
            if (part.name.toLowerCase() === name.toLowerCase()) {
                target = part.id;
                break;
            }
        }
        if (!target)
            throw new Error(`Failed to assign target to part`);
        const res = yield (0, connection_1.runQuery)(`UPDATE part_number SET partial_delivery = 1 Where id = ?`, [target]);
        if ("code" in res)
            throw new Error(`Failed to set partial_delivery to 1 for id ${res.message}`);
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.patchPartialStatus = patchPartialStatus;
const addParcelsToOrder = (parcels, purchaseOrder, part) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parcelIds = [];
        for (const parcel of parcels) {
            const res = yield (0, connection_1.runQuery)(`insert into amount_received (amount_received) values (?)`, [parcel]);
            if ("code" in res)
                throw new Error(`Failed to insert new parcel ${res.message}`);
            parcelIds.push(res.insertId);
        }
        const purchaseId = yield (0, connection_1.runQuery)("select id from purchase_order where purchase_order = ?", [purchaseOrder]);
        if ("code" in purchaseId)
            throw new Error(`Failed to select id from purchase order ${purchaseId.message}`);
        const partId = yield (0, connection_1.runQuery)("Select id from part_number where part = ? ", [
            part,
        ]);
        if ("code" in partId)
            throw new Error(`Failed to select id for part_number ${partId.message}`);
        for (const id of parcelIds) {
            const result = yield (0, connection_1.runQuery)("insert into pn_received (part_number, amount_received) values (?,?)", [partId[0].id, id]);
            if ("code" in result)
                throw new Error(`Failed to create relation between parcel and part\nParcel: ${parcels}\nPart: ${part} `);
        }
        return true;
    }
    catch (error) {
        console.error(error);
        return;
    }
});
exports.addParcelsToOrder = addParcelsToOrder;
