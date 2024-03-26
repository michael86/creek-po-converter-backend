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
const tokens_1 = require("../utils/tokens");
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
                const sku = yield rq(`insert into part_number (part, description) values (?, ?)`, [
                    part[0],
                    part[2],
                ]);
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
            if ((error instanceof Error && error.message.includes("ER_DUP_ENTRY")) ||
                (typeof error === "string" && error.includes("ER_DUP_ENTRY"))) {
                return "dupe";
            }
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
                const partNumber = yield rq(`select part, description from part_number where id = ?`, [
                    relation.part_number,
                ]);
                const qtyRelation = yield rq(`select count from pn_count where part_number = ?`, [
                    relation.part_number,
                ]);
                for (const count of qtyRelation) {
                    const qty = yield rq(`SELECT quantity FROM count WHERE id = ?`, [count.count]);
                    partNumbers.push([partNumber[0].part, qty[0].quantity, partNumber[0].description]);
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
            const user = yield rq("insert into users (email, password) values (?, ?)", [email, password]);
            if (!user.insertId)
                throw new Error(`Failed to create new user ${user}`);
            const token = (0, tokens_1.generateToken)();
            if (!token)
                throw new Error(`Failed to create new user (token) ${token}`);
            const tokenId = yield rq(`INSERT INTO tokens (token) VALUES (?)`, [token]);
            if (!tokenId.insertId)
                throw new Error(`Failed to create new user (token insert) ${tokenId}`);
            const relation = yield rq(`INSERT INTO user_token (user, token) VALUES (?, ? )`, [
                user.insertId,
                tokenId.insertId,
            ]);
            if (!relation.insertId)
                throw new Error(`Failed to create user (user/token relation) ${relation}}`);
            return token;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }),
    validateLogin: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield rq(`SELECT  password, id FROM users WHERE email = ?`, [email]);
            return user;
        }
        catch (error) {
            console.log("Validate login ", error);
            return;
        }
    }),
    storeToken: (token, id) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            // const tokenId = await rq(`insert into tokens`)
        }
        catch (error) { }
    }),
    validateUserToken: (email, token) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let user = yield rq(`Select id from users Where email = ? `, [email]);
            if (!user.length)
                return;
            user = user[0].id;
            let userTokenId = yield rq(`select token from user_token where user = ?`, [user]);
            if (!userTokenId[0].token)
                return;
            userTokenId = userTokenId[0].token;
            let _token = yield rq(`select token from tokens where id = ?`, [userTokenId]);
            if (!_token[0].token)
                return;
            _token = _token[0].token;
            return _token === token;
        }
        catch (error) {
            console.log("Failed to validate User Token ", error);
            return;
        }
    }),
    setTokenToNull: (email, token) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = yield rq(`SELECT id from users where email = ?`, [email]);
            if (!userId[0].id)
                return;
            const relation = yield rq(`select token from user_token where user = ?`, userId[0].id);
            if (!relation[0].token)
                return;
            const _token = yield rq(`select token from tokens where id = ?`, [relation[0].token]);
            if (!_token[0].token)
                return;
            if (_token[0].token !== token)
                return;
            const tokenRemoved = yield rq(`UPDATE tokens SET token = null WHERE id = ?`, relation[0].token);
            if (!tokenRemoved.affectedRows)
                return;
            return true;
        }
        catch (error) {
            console.log(`Failed to log out user: ${error}`);
            return;
        }
    }),
    updateUserToken: (email, token) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const userId = yield rq(`SELECT id from users where email = ?`, [email]);
            if (!userId[0].id)
                return;
            const relation = yield rq(`select token from user_token where user = ?`, userId[0].id);
            if (!relation[0].token)
                return;
            yield rq(`update tokens set token = ? where id = ?`, [token, relation[0].token]);
            return true;
        }
        catch (error) {
            console.log(`Failed to update user token: ${error}`);
            return;
        }
    }),
};
module.exports = queries;
