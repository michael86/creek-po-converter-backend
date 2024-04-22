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
const connection_1 = require("./connection");
//
const queries = {
    parts: {
        fetchPrefixes: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const prefixes = yield (0, connection_1.runQuery)(`select prefix from prefixes`, []);
                if ("code" in prefixes)
                    throw new Error(`error fetching prefixes \n${prefixes}`);
                if (!prefixes[0])
                    throw new Error(`Failed to fetch prefixes ${prefixes}`);
                return prefixes.map((entry) => entry.prefix);
            }
            catch (error) {
                console.error(error);
            }
        }),
        insertPrefix: (prefix) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const res = yield (0, connection_1.runQuery)(`insert into prefixes (prefix) values (?)`, [
                    prefix,
                ]);
                if ("code" in res)
                    throw new Error(`error fetching prefixes \n${res}`);
                if (!res.affectedRows) {
                    return;
                }
                return true;
            }
            catch (error) {
                console.error(`error inserting prefix ${error}`);
                return;
            }
        }),
    },
    purchaseOrders: {
        //Rename this to insert data to db
        insertDataToDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const purchase = yield (0, connection_1.runQuery)(`insert into purchase_order (purchase_order) values (?)`, [data.PURCHASE_ORDER]);
                if ("code" in purchase)
                    throw new Error(`error fetching prefixes \n${purchase}`);
                if (!purchase.insertId)
                    return;
                const order = yield (0, connection_1.runQuery)(`insert into order_reference (order_reference) values (?)`, [data.ORDER_REFERENCE]);
                if ("code" in order)
                    throw new Error(`error fetching prefixes \n${order}`);
                if (!order.insertId)
                    return;
                const skuCountIds = [];
                for (const part of data.DATA) {
                    const [sku, quantity] = yield Promise.all([
                        (0, connection_1.runQuery)(`insert into part_number (part, description) values (?, ?)`, [
                            part[0],
                            part[2],
                        ]),
                        (0, connection_1.runQuery)(`INSERT INTO \`total_ordered\` (quantity) VALUES (?);`, [Number(part[1])]),
                    ]);
                    if (!sku.insertId || !quantity.insertId)
                        throw new Error(`sku: ${sku} \n qty: ${quantity}`);
                    skuCountIds.push([+sku.insertId, +quantity.insertId]);
                }
                const purchaseOrder = purchase.insertId;
                const orderRef = order.insertId;
                const poOrRef = yield (0, connection_1.runQuery)(`INSERT INTO \`po_or\` (purchase_order, order_reference) VALUES (?, ?);`, [purchaseOrder, orderRef]);
                if (!poOrRef.insertId)
                    throw new Error(poOrRef);
                for (const part of skuCountIds) {
                    const poPart = yield (0, connection_1.runQuery)(`INSERT INTO \`po_pn\` (purchase_order, part_number) VALUES (?, ?);`, [purchaseOrder, part[0]]);
                    if (!poPart.insertId)
                        throw new Error(poPart);
                }
                for (const part of skuCountIds) {
                    const pnCount = yield (0, connection_1.runQuery)(`INSERT INTO \`pn_count\` (part_number, count) VALUES (?, ?);`, [part[0], part[1]]);
                    if (!pnCount.insertId)
                        throw new Error(pnCount);
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
        }),
        fetchPurchaseOrders: () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const data = yield (0, connection_1.runQuery)(`SELECT purchase_order as purchaseOrder FROM purchase_order`, []);
                return [...data];
            }
            catch (error) {
                console.error(error);
                return;
            }
        }),
        fetchPurchaseOrder: (id) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                let poId = yield (0, connection_1.runQuery)(`SELECT id FROM purchase_order WHERE purchase_order = ?`, [id]);
                if (!poId[0].id)
                    throw new Error(`purchase_order Failed to find ${id}`);
                poId = poId[0].id;
                let refId = yield (0, connection_1.runQuery)(`SELECT order_reference FROM po_or WHERE purchase_order = ?`, [
                    poId,
                ]);
                if (!refId[0].order_reference)
                    throw new Error(`po_or Failed to find ${id}`);
                refId = refId[0].order_reference;
                let orderRef = yield (0, connection_1.runQuery)(`SELECT order_reference FROM order_reference WHERE id = ?`, [
                    refId,
                ]);
                if (!orderRef[0].order_reference)
                    throw new Error(`order_reference Failed to find ${id}`);
                orderRef = orderRef[0].order_reference;
                const partNumerRelations = yield (0, connection_1.runQuery)(`SELECT part_number FROM po_pn WHERE purchase_order = ? `, [poId]);
                const retval = {
                    purchaseOrder: id,
                    orderRef,
                    partNumbers: {},
                };
                for (const relation of partNumerRelations) {
                    const [partNumber, qtyRelation, partsReceived] = yield Promise.all([
                        (0, connection_1.runQuery)(`select part, description, partial_delivery from part_number where id = ?`, [
                            relation.part_number,
                        ]),
                        (0, connection_1.runQuery)(`select count from pn_count where part_number = ?`, [relation.part_number]),
                        (0, connection_1.runQuery)(`select amount_received from pn_received where part_number = ?`, [
                            relation.part_number,
                        ]),
                    ]);
                    retval.partNumbers[partNumber[0].part] = {
                        name: partNumber[0].part,
                        totalOrdered: undefined,
                        quantityAwaited: undefined,
                        partial: partNumber[0].partial_delivery,
                        description: partNumber[0].description,
                        partsReceived: undefined,
                    };
                    for (const count of qtyRelation) {
                        const qty = yield (0, connection_1.runQuery)(`SELECT quantity FROM total_ordered WHERE id = ?`, [
                            count.count,
                        ]);
                        retval.partNumbers[partNumber[0].part].totalOrdered = qty[0].quantity;
                        retval.partNumbers[partNumber[0].part].quantityAwaited = qty[0].quantity;
                    }
                    retval.partNumbers[partNumber[0].part].partsReceived = partsReceived.length
                        ? []
                        : undefined;
                    for (const { amount_received } of partsReceived) {
                        const [total] = yield (0, connection_1.runQuery)(`select amount_received from amount_received where id = ?`, [amount_received]);
                        (_a = retval.partNumbers[partNumber[0].part].partsReceived) === null || _a === void 0 ? void 0 : _a.push(total.amount_received);
                    }
                }
                return {
                    purchaseOrder: id,
                    orderRef,
                    partNumbers: retval.partNumbers,
                };
            }
            catch (error) {
                console.error(error);
                return null;
            }
        }),
        patchPartialStatus: (order, name) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const id = yield (0, connection_1.runQuery)(`SELECT id from purchase_order WHERE purchase_order = ?`, [
                    order,
                ]);
                if (!id[0])
                    throw new Error(`Failed to select id for purchase order ${order}`);
                const partIds = yield (0, connection_1.runQuery)(`SELECT id, part as name from part_number WHERE part = ?`, [name]);
                let target;
                for (const part of partIds) {
                    if (part.name.toLowerCase() === name.toLowerCase()) {
                        target = part.id;
                        break;
                    }
                }
                const res = yield (0, connection_1.runQuery)(`UPDATE part_number SET partial_delivery = 1 Where id = ?`, [
                    target,
                ]);
                if (!res.affectedRows)
                    throw new Error(`Failed to set partial_delivery to 1 for id ${target}`);
                return true;
            }
            catch (error) {
                console.error(error);
                return;
            }
        }),
        addParcelsToOrder: (parcels, purchaseOrder, part) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const parcelIds = [];
                for (const parcel of parcels) {
                    const res = yield (0, connection_1.runQuery)(`insert into amount_received (amount_received) values (?)`, [
                        parcel,
                    ]);
                    if (!res.insertId)
                        throw new Error(`Failed to insert new parcel ${parcels}`);
                    parcelIds.push(res.insertId);
                }
                const purchaseId = yield (0, connection_1.runQuery)("select id from purchase_order where purchase_order = ?", [purchaseOrder]);
                if (!purchaseId[0].id)
                    throw new Error(`Failed to select id for purchase ${purchaseOrder}`);
                const partId = yield (0, connection_1.runQuery)("Select id from part_number where part = ? ", [part]);
                if (!partId[0].id)
                    throw new Error(`Failed to select id for part_number ${part}`);
                for (const id of parcelIds) {
                    const result = yield (0, connection_1.runQuery)("insert into pn_received (part_number, amount_received) values (?,?)", [partId[0].id, id]);
                    if (!result.insertId)
                        throw new Error(`Failed to create relation between parcel and part\nParcel: ${parcels}\nPart: ${part} `);
                }
                return true;
            }
            catch (error) {
                console.error(error);
                return;
            }
        }),
    },
};
module.exports = queries;
