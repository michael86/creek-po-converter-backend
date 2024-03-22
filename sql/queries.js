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
const { runQuery: rq } = require("./connection");
const queries = {
    insertDataToDb: (data) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const purchase = yield rq(`insert into purchase_order (purchase_order) values (?)`, [
                data.PURCHASE_ORDER,
            ]);
            if (!purchase.insertId)
                throw new Error(purchase);
            const order = yield rq(`insert into order_reference (order_reference) values (?)`, [
                data.ORDER_REFERENCE,
            ]);
            if (!order.insertId)
                throw new Error(order);
            const skuCountIds = [];
            for (const part of data.DATA) {
                const sku = yield rq(`insert into part_number (part) values (?)`, [part[0]]);
                const quantity = yield rq(`INSERT INTO \`count\` (quantity) VALUES (?);`, [
                    Number(part[1]),
                ]);
                if (!sku.insertId || !quantity.insertId)
                    throw new Error(`sku: ${sku} \n qty: ${quantity}`);
                skuCountIds.push([+sku.insertId, +quantity.insertId]);
            }
            const purchaseOrder = purchase.insertId;
            const orderRef = order.insertId;
            const poOrRef = yield rq(`INSERT INTO \`po_or\` (purchase_order, order_reference) VALUES (?, ?);`, [purchaseOrder, orderRef]);
            if (!poOrRef.insertId)
                throw new Error(poOrRef);
            for (const part of skuCountIds) {
                const poPart = yield rq(`INSERT INTO \`po_pn\` (purchase_order, part_number) VALUES (?, ?);`, [purchaseOrder, part[0]]);
                if (!poPart.insertId)
                    throw new Error(poPart);
            }
            for (const part of skuCountIds) {
                const pnCount = yield rq(`INSERT INTO \`pn_count\` (part_number, count) VALUES (?, ?);`, [
                    part[0],
                    part[1],
                ]);
                if (!pnCount.insertId)
                    throw new Error(pnCount);
            }
            return true;
        }
        catch (error) {
            console.log(`failed to insert data to db `, error);
            return false;
        }
    }),
    fetchPurchaseOrders: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield rq(`SELECT purchase_order FROM purchase_order`, []);
            return [...data];
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }),
    fetchPurchaseOrder: (id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let poId = yield rq(`SELECT id FROM purchase_order WHERE purchase_order = ?`, [id]);
            if (!poId[0].id)
                throw new Error(`purchase_order Failed to find ${id}`);
            poId = poId[0].id;
            let refId = yield rq(`SELECT order_reference FROM po_or WHERE purchase_order = ?`, [poId]);
            if (!refId[0].order_reference)
                throw new Error(`po_or Failed to find ${id}`);
            refId = refId[0].order_reference;
            let orderRef = yield rq(`SELECT order_reference FROM order_reference WHERE id = ?`, [refId]);
            if (!orderRef[0].order_reference)
                throw new Error(`order_reference Failed to find ${id}`);
            orderRef = orderRef[0].order_reference;
            const partNumerRelations = yield rq(`SELECT part_number FROM po_pn WHERE purchase_order = ? `, [poId]);
            const partNumbers = [];
            for (const relation of partNumerRelations) {
                const partNumber = yield rq(`select part from part_number where id = ?`, [
                    relation.part_number,
                ]);
                const qtyRelation = yield rq(`select count from pn_count where part_number = ?`, [
                    relation.part_number,
                ]);
                for (const count of qtyRelation) {
                    const qty = yield rq(`SELECT quantity FROM count WHERE id = ?`, [count.count]);
                    partNumbers.push([partNumber[0].part, qty[0].quantity]);
                }
            }
            return {
                purchaseOrder: id,
                orderRef,
                partNumbers,
            };
        }
        catch (error) {
            console.log(error);
            return false;
        }
    }),
    selectEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const inUse = yield rq("select email from users where email = ?", [email]);
            return inUse.length;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }),
    createUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const created = yield rq("insert into users (email, password) values (?, ?)", [
                email,
                password,
            ]);
            console.log(created);
            return created.insertId;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }),
};
module.exports = queries;
