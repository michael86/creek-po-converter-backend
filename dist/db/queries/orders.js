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
exports.addParcelsToOrder = exports.patchPartialStatus = exports.fetchPurchaseOrder = exports.fetchPurchaseOrders = exports.insertDataToDb = void 0;
const connection_1 = require("../connection");
const insertDataToDb = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const purchase = yield (0, connection_1.runQuery)(`insert into purchase_order (purchase_order) values (?)`, [data.PURCHASE_ORDER]);
        if ("code" in purchase)
            throw new Error(`error fetching prefixes \n${purchase}`);
        const order = yield (0, connection_1.runQuery)(`insert into order_reference (order_reference) values (?)`, [data.ORDER_REFERENCE]);
        if ("code" in order)
            throw new Error(`error fetching prefixes \n${order}`);
        const skuCountIds = [];
        for (const part of data.DATA) {
            const [sku, quantity] = yield Promise.all([
                (0, connection_1.runQuery)(`insert into part_number (part, description) values (?, ?)`, [
                    part[0],
                    part[2],
                ]),
                (0, connection_1.runQuery)(`INSERT INTO \`total_ordered\` (quantity) VALUES (?);`, [
                    Number(part[1]),
                ]),
            ]);
            if ("code" in sku)
                throw new Error(`Error adding purchase order, failed to insert sku ${sku}`);
            if ("code" in quantity)
                throw new Error(`Error adding purchase order, failed to insert quantity ${quantity}`);
            skuCountIds.push([+sku.insertId, +quantity.insertId]);
        }
        const purchaseOrder = purchase.insertId;
        const orderRef = order.insertId;
        const poOrRef = yield (0, connection_1.runQuery)(`INSERT INTO \`po_or\` (purchase_order, order_reference) VALUES (?, ?);`, [purchaseOrder, orderRef]);
        if ("code" in poOrRef)
            throw new Error(`Failed to insert new PO. Relation failed ${poOrRef.message}`);
        for (const part of skuCountIds) {
            const poPart = yield (0, connection_1.runQuery)(`INSERT INTO \`po_pn\` (purchase_order, part_number) VALUES (?, ?);`, [purchaseOrder, part[0]]);
            if ("code" in poPart)
                throw new Error(`Error adding purchase order, failed to insert po_or ${poPart.message}`);
        }
        for (const part of skuCountIds) {
            const pnCount = yield (0, connection_1.runQuery)(`INSERT INTO \`pn_count\` (part_number, count) VALUES (?, ?);`, [part[0], part[1]]);
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
exports.insertDataToDb = insertDataToDb;
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
    var _a;
    try {
        let poId = yield (0, connection_1.runQuery)(`SELECT id FROM purchase_order WHERE purchase_order = ?`, [id]);
        if ("code" in poId)
            throw new Error(`purchase_order Failed to find ${id}\n${poId.message}`);
        let refId = yield (0, connection_1.runQuery)(`SELECT order_reference FROM po_or WHERE purchase_order = ?`, [poId[0].id]);
        if ("code" in refId)
            throw new Error(`po_or Failed to find ${refId.message}`);
        let orderRef = yield (0, connection_1.runQuery)(`SELECT order_reference FROM order_reference WHERE id = ?`, [refId[0].order_reference]);
        if ("code" in orderRef)
            throw new Error(`order_reference Failed to find ${orderRef.message}`);
        const partNumerRelations = yield (0, connection_1.runQuery)(`SELECT part_number FROM po_pn WHERE purchase_order = ? `, [orderRef[0].order_reference]);
        if ("code" in partNumerRelations)
            throw new Error(`Failed to select partNumberRelations ${partNumerRelations.message}`);
        const retval = {
            purchaseOrder: id,
            orderRef: orderRef[0].order_reference,
            partNumbers: {},
        };
        for (const relation of partNumerRelations) {
            const [partNumber, qtyRelation, partsReceived] = yield Promise.all([
                (0, connection_1.runQuery)(`select part, description, partial_delivery from part_number where id = ?`, [relation.part_number]),
                (0, connection_1.runQuery)(`select count from pn_count where part_number = ?`, [
                    relation.part_number,
                ]),
                (0, connection_1.runQuery)(`select amount_received from pn_received where part_number = ?`, [
                    relation.part_number,
                ]),
            ]);
            if ("code" in partNumber)
                throw new Error(`Failed to select partNumber ${partNumber.message}`);
            if ("code" in qtyRelation)
                throw new Error(`Failed to select qtyRelation ${qtyRelation.message}`);
            if ("code" in partsReceived)
                throw new Error(`Failed to select partsReceived ${partsReceived.message}`);
            retval.partNumbers[partNumber[0].part] = {
                name: partNumber[0].part,
                totalOrdered: undefined,
                quantityAwaited: undefined,
                partial: +partNumber[0].partial_delivery,
                description: partNumber[0].description,
                partsReceived: undefined,
            };
            for (const count of qtyRelation) {
                const qty = yield (0, connection_1.runQuery)(`SELECT quantity FROM total_ordered WHERE id = ?`, [count.count]);
                if ("code" in qty)
                    throw new Error(`Error selecing qty ${qty.message}`);
                retval.partNumbers[partNumber[0].part].totalOrdered = +qty[0].quantity;
                // retval.partNumbers[partNumber[0].part].quantityAwaited = qty[0].quantity;
                retval.partNumbers[partNumber[0].part].quantityAwaited = [[100], [451]];
            }
            retval.partNumbers[partNumber[0].part].partsReceived = partsReceived.length ? [] : undefined;
            for (const { amount_received } of partsReceived) {
                const total = yield (0, connection_1.runQuery)(`select amount_received from amount_received where id = ?`, [amount_received]);
                if ("code" in total)
                    throw new Error(`failed to select amount received ${total.message}`);
                (_a = retval.partNumbers[partNumber[0].part].partsReceived) === null || _a === void 0 ? void 0 : _a.push(+total[0].amount_received);
            }
        }
        return {
            purchaseOrder: id,
            orderRef: orderRef[0].order_reference,
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
