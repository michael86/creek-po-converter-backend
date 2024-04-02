import { generateToken } from "../utils/tokens";
const { runQuery: rq } = require("./connection");

type Data = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };

export type PurchaseOrder = {
  purchaseOrder: string;
  orderRef: string;
  partNumbers: {
    [key: string]: {
      name: string;
      quantityReceived: number[][];
      partial: 1 | 0;
      totalOrdered: number;
      description: string;
    };
  };
};

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
        const [sku, quantity] = await Promise.all([
          rq(`insert into part_number (part, description) values (?, ?)`, [part[0], part[2]]),
          rq(`INSERT INTO \`total_ordered\` (quantity) VALUES (?);`, [Number(part[1])]),
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
      if (
        (error instanceof Error && error.message.includes("ER_DUP_ENTRY")) ||
        (typeof error === "string" && error.includes("ER_DUP_ENTRY"))
      ) {
        return "dupe";
      }
      console.error(`failed to insert data to db `, error);
      return false;
    }
  },
  fetchPurchaseOrders: async () => {
    try {
      const data = await rq(`SELECT purchase_order as purchaseOrder FROM purchase_order`, []);
      return [...data];
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  fetchPurchaseOrder: async (id: string): Promise<PurchaseOrder | null> => {
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

      const retval: PurchaseOrder = {
        purchaseOrder: id,
        orderRef,
        partNumbers: {},
      };

      for (const relation of partNumerRelations) {
        const [partNumber, qtyRelation] = await Promise.all([
          rq(`select part, description, partial_delivery from part_number where id = ?`, [
            relation.part_number,
          ]),
          rq(`select count from pn_count where part_number = ?`, [relation.part_number]),
        ]);

        for (const count of qtyRelation) {
          const qty = await rq(`SELECT quantity FROM total_ordered WHERE id = ?`, [count.count]);

          retval.partNumbers[partNumber[0].part] = {
            name: partNumber[0].part,
            totalOrdered: qty[0].quantity,
            quantityReceived: qty[0].quantity,
            partial: partNumber[0].partial_delivery,
            description: partNumber[0].description,
          };
        }
      }
      return {
        purchaseOrder: id,
        orderRef,
        partNumbers: retval.partNumbers,
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  selectEmail: async (email: string) => {
    try {
      const inUse = await rq("select email from users where email = ?", [email]);
      return inUse.length;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createUser: async (email: string, password: string) => {
    try {
      const [user, token] = await Promise.all([
        rq("insert into users (email, password) values (?, ?)", [email, password]),
        generateToken(),
      ]);

      if (!user.insertId) throw new Error(`Failed to create new user ${user}`);
      if (!token) throw new Error(`Failed to create new user (token) ${token}`);

      const tokenId = await rq(`INSERT INTO tokens (token) VALUES (?)`, [token]);
      if (!tokenId.insertId) throw new Error(`Failed to create new user (token insert) ${tokenId}`);

      const relation = await rq(`INSERT INTO user_token (user, token) VALUES (?, ? )`, [
        user.insertId,
        tokenId.insertId,
      ]);
      if (!relation.insertId)
        throw new Error(`Failed to create user (user/token relation) ${relation}}`);

      return token;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  validateLogin: async (email: string) => {
    try {
      const user = await rq(`SELECT  password, id FROM users WHERE email = ?`, [email]);
      return user;
    } catch (error) {
      console.error("Validate login ", error);
      return;
    }
  },
  storeToken: async (token: string, id: number) => {
    try {
      // const tokenId = await rq(`insert into tokens`)
    } catch (error) {}
  },
  validateUserToken: async (email: string, token: string) => {
    try {
      let user = await rq(`Select id from users Where email = ? `, [email]);
      if (!user.length) return;
      user = user[0].id;

      let userTokenId = await rq(`select token from user_token where user = ?`, [user]);
      if (!userTokenId[0].token) return;
      userTokenId = userTokenId[0].token;

      let _token = await rq(`select token from tokens where id = ?`, [userTokenId]);
      if (!_token[0].token) return;
      _token = _token[0].token;

      return _token === token;
    } catch (error) {
      console.error("Failed to validate User Token ", error);
      return;
    }
  },
  setTokenToNull: async (email: string, token: string) => {
    try {
      const userId = await rq(`SELECT id from users where email = ?`, [email]);
      if (!userId[0].id) return;

      const relation = await rq(`select token from user_token where user = ?`, userId[0].id);
      if (!relation[0].token) return;

      const _token = await rq(`select token from tokens where id = ?`, [relation[0].token]);
      if (!_token[0].token) return;

      if (_token[0].token !== token) return;

      const tokenRemoved = await rq(
        `UPDATE tokens SET token = null WHERE id = ?`,
        relation[0].token
      );
      if (!tokenRemoved.affectedRows) return;

      return true;
    } catch (error) {
      console.error(`Failed to log out user: ${error}`);
      return;
    }
  },
  updateUserToken: async (email: string, token: string) => {
    try {
      const userId = await rq(`SELECT id from users where email = ?`, [email]);
      if (!userId[0].id) return;

      const relation = await rq(`select token from user_token where user = ?`, userId[0].id);
      if (!relation[0].token) return;

      await rq(`update tokens set token = ? where id = ?`, [token, relation[0].token]);
      return true;
    } catch (error) {
      console.error(`Failed to update user token: ${error}`);
      return;
    }
  },
};

module.exports = queries;
