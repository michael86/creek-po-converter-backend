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
};
module.exports = queries;
