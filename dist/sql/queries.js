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
                const [sku, quantity] = yield Promise.all([
                    rq(`insert into part_number (part, description) values (?, ?)`, [part[0], part[2]]),
                    rq(`INSERT INTO \`total_ordered\` (quantity) VALUES (?);`, [Number(part[1])]),
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
            console.error(`failed to insert data to db `, error);
            return false;
        }
    }),
    fetchPurchaseOrders: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const data = yield rq(`SELECT purchase_order as purchaseOrder FROM purchase_order`, []);
            return [...data];
        }
        catch (error) {
            console.error(error);
            return false;
        }
    }),
    fetchPurchaseOrder: (id) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
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
            const retval = {
                purchaseOrder: id,
                orderRef,
                partNumbers: {},
            };
            for (const relation of partNumerRelations) {
                const [partNumber, qtyRelation, partsReceived] = yield Promise.all([
                    rq(`select part, description, partial_delivery from part_number where id = ?`, [
                        relation.part_number,
                    ]),
                    rq(`select count from pn_count where part_number = ?`, [relation.part_number]),
                    rq(`select amount_received from pn_received where part_number = ?`, [
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
                    const qty = yield rq(`SELECT quantity FROM total_ordered WHERE id = ?`, [count.count]);
                    retval.partNumbers[partNumber[0].part].totalOrdered = qty[0].quantity;
                    retval.partNumbers[partNumber[0].part].quantityAwaited = qty[0].quantity;
                }
                retval.partNumbers[partNumber[0].part].partsReceived = partsReceived.length
                    ? []
                    : undefined;
                for (const { amount_received } of partsReceived) {
                    const [total] = yield rq(`select amount_received from amount_received where id = ?`, [
                        amount_received,
                    ]);
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
    selectEmail: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const inUse = yield rq("select email from users where email = ?", [email]);
            return inUse.length;
        }
        catch (error) {
            console.error(error);
            return;
        }
    }),
    createUser: (email, password) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const [user, token] = yield Promise.all([
                rq("insert into users (email, password) values (?, ?)", [email, password]),
                (0, tokens_1.generateToken)(),
            ]);
            if (!user.insertId)
                throw new Error(`Failed to create new user ${user}`);
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
            console.error(error);
            return;
        }
    }),
    validateLogin: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const user = yield rq(`SELECT password, id FROM users WHERE email = ?`, [email]);
            return user;
        }
        catch (error) {
            console.error("Validate login ", error);
            return;
        }
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
            console.error("Failed to validate User Token ", error);
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
            console.error(`Failed to log out user: ${error}`);
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
            console.error(`Failed to update user token: ${error}`);
            return;
        }
    }),
    patchPartialStatus: (order, name) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = yield rq(`SELECT id from purchase_order WHERE purchase_order = ?`, [order]);
            if (!id[0])
                throw new Error(`Failed to select id for purchase order ${order}`);
            const partIds = yield rq(`SELECT id, part as name from part_number WHERE part = ?`, [
                name,
            ]);
            let target;
            for (const part of partIds) {
                if (part.name.toLowerCase() === name.toLowerCase()) {
                    target = part.id;
                    break;
                }
            }
            const res = yield rq(`UPDATE part_number SET partial_delivery = 1 Where id = ?`, [target]);
            if (!res.affectedRows)
                throw new Error(`Failed to set partial_delivery to 1 for id ${target}`);
            return true;
        }
        catch (error) {
            return error;
        }
    }),
    addParcelsToOrder: (parcels, purchaseOrder, part) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const parcelIds = [];
            for (const parcel of parcels) {
                const res = yield rq(`insert into amount_received (amount_received) values (?)`, [parcel]);
                if (!res.insertId)
                    throw new Error(`Failed to insert new parcel ${parcels}`);
                parcelIds.push(res.insertId);
            }
            const purchaseId = yield rq("select id from purchase_order where purchase_order = ?", [
                purchaseOrder,
            ]);
            if (!purchaseId[0].id)
                throw new Error(`Failed to select id for purchase ${purchaseOrder}`);
            const partId = yield rq("Select id from part_number where part = ? ", [part]);
            if (!partId[0].id)
                throw new Error(`Failed to select id for part_number ${part}`);
            for (const id of parcelIds) {
                const result = yield rq("insert into pn_received (part_number, amount_received) values (?,?)", [partId[0].id, id]);
                if (!result.insertId)
                    throw new Error(`Failed to create relation between parcel and part\nParcel: ${parcels}\nPart: ${part} `);
            }
            return true;
        }
        catch (error) {
            return error;
        }
    }),
    getUserRole: (email) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        try {
            const role = yield rq("select role from users where email =? ", [email]);
            if (!((_b = role[0]) === null || _b === void 0 ? void 0 : _b.role))
                return;
            return role[0].role;
        }
        catch (error) {
            console.error(error);
            return;
        }
    }),
};
module.exports = queries;
