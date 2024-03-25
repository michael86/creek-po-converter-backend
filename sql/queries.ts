import { create } from "domain";
import { generateToken } from "../utils/tokens";

type Data = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };
const { runQuery: rq } = require("./connection");

const queries = {
  insertDataToDb: async (data: Data) => {
    try {
      const purchase = await rq(`insert into purchase_order (purchase_order) values (?)`, [
        data.PURCHASE_ORDER,
      ]);
      if (!purchase.insertId) throw new Error(purchase);

      const order = await rq(`insert into order_reference (order_reference) values (?)`, [
        data.ORDER_REFERENCE,
      ]);
      if (!order.insertId) throw new Error(order);

      const skuCountIds: number[][] = [];

      for (const part of data.DATA) {
        const sku = await rq(`insert into part_number (part) values (?)`, [part[0]]);
        const quantity = await rq(`INSERT INTO \`count\` (quantity) VALUES (?);`, [
          Number(part[1]),
        ]);

        if (!sku.insertId || !quantity.insertId) throw new Error(`sku: ${sku} \n qty: ${quantity}`);
        skuCountIds.push([+sku.insertId, +quantity.insertId]);
      }

      const purchaseOrder = purchase.insertId;
      const orderRef = order.insertId;
      const poOrRef = await rq(
        `INSERT INTO \`po_or\` (purchase_order, order_reference) VALUES (?, ?);`,
        [purchaseOrder, orderRef]
      );
      if (!poOrRef.insertId) throw new Error(poOrRef);

      for (const part of skuCountIds) {
        const poPart = await rq(
          `INSERT INTO \`po_pn\` (purchase_order, part_number) VALUES (?, ?);`,
          [purchaseOrder, part[0]]
        );
        if (!poPart.insertId) throw new Error(poPart);
      }

      for (const part of skuCountIds) {
        const pnCount = await rq(`INSERT INTO \`pn_count\` (part_number, count) VALUES (?, ?);`, [
          part[0],
          part[1],
        ]);
        if (!pnCount.insertId) throw new Error(pnCount);
      }
      return true;
    } catch (error) {
      console.log(`failed to insert data to db `, error);
      return false;
    }
  },
  fetchPurchaseOrders: async () => {
    try {
      const data = await rq(`SELECT purchase_order FROM purchase_order`, []);
      return [...data];
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  fetchPurchaseOrder: async (id: string) => {
    try {
      let poId = await rq(`SELECT id FROM purchase_order WHERE purchase_order = ?`, [id]);
      if (!poId[0].id) throw new Error(`purchase_order Failed to find ${id}`);
      poId = poId[0].id;

      let refId = await rq(`SELECT order_reference FROM po_or WHERE purchase_order = ?`, [poId]);
      if (!refId[0].order_reference) throw new Error(`po_or Failed to find ${id}`);
      refId = refId[0].order_reference;

      let orderRef = await rq(`SELECT order_reference FROM order_reference WHERE id = ?`, [refId]);

      if (!orderRef[0].order_reference) throw new Error(`order_reference Failed to find ${id}`);
      orderRef = orderRef[0].order_reference;

      const partNumerRelations = await rq(
        `SELECT part_number FROM po_pn WHERE purchase_order = ? `,
        [poId]
      );

      const partNumbers: string[][] = [];
      for (const relation of partNumerRelations) {
        const partNumber = await rq(`select part from part_number where id = ?`, [
          relation.part_number,
        ]);
        const qtyRelation = await rq(`select count from pn_count where part_number = ?`, [
          relation.part_number,
        ]);

        for (const count of qtyRelation) {
          const qty = await rq(`SELECT quantity FROM count WHERE id = ?`, [count.count]);

          partNumbers.push([partNumber[0].part, qty[0].quantity]);
        }
      }

      return {
        purchaseOrder: id,
        orderRef,
        partNumbers,
      };
    } catch (error) {
      console.log(error);
      return false;
    }
  },

  selectEmail: async (email: string) => {
    try {
      const inUse = await rq("select email from users where email = ?", [email]);

      return inUse.length;
    } catch (error) {
      console.log(error);
      return;
    }
  },

  createUser: async (email: string, password: string) => {
    try {
      const user = await rq("insert into users (email, password) values (?, ?)", [email, password]);
      if (!user.insertId) throw new Error(`Failed to create new user ${user}`);

      const token = generateToken();
      if (!token) throw new Error(`Failed to create new user (token) ${token}`);

      const tokenId = await rq(`INSERT INTO tokens (token) VALUES (?)`, [token]);
      if (!tokenId.insertId) throw new Error(`Failed to create new user (token insert) ${tokenId}`);

      const relation = await rq(`INSERT INTO user_token (user, token) VALUES (?, ? )`, [
        user.insertId,
        tokenId.insertId,
      ]);
      console.log("relation ", relation);
      if (!relation.insertId)
        throw new Error(`Failed to create user (user/token relation) ${relation}}`);

      return token;
    } catch (error) {
      console.log(error);
      return;
    }
  },

  validateLogin: async (email: string) => {
    try {
      const user = await rq(`SELECT  password, id FROM users WHERE email = ?`, [email]);
      return user;
    } catch (error) {
      console.log("Validate login ", error);
      return;
    }
  },

  storeToken: async (token: string, id: number) => {
    try {
      // const tokenId = await rq(`insert into tokens`)
    } catch (error) {}
  },
};

module.exports = queries;
