import { FecthRequest, PutRequest } from "../types/sql";
import { generateToken } from "../utils/tokens";
import { runQuery } from "./connection";

type Data = { DATA: []; ORDER_REFERENCE: string; PURCHASE_ORDER: string };

export type PurchaseOrder = {
  purchaseOrder: string;
  orderRef: string;
  partNumbers: {
    [key: string]: {
      name: string;
      quantityAwaited: number[][] | undefined;
      partial: 1 | 0;
      totalOrdered: number | undefined;
      description: string;
      partsReceived: number[] | undefined;
    };
  };
};

type sqlReturn = { [key: string]: string | number }[];
const queries: {
  // getUserRole: GetUserRole
} = {
  fetchPrefixes: async () => {
    try {
      const prefixes = await runQuery<FecthRequest>(`select prefix from prefixes`, []);
      if ("code" in prefixes) throw new Error(`error fetching prefixes \n${prefixes}`);

      if (!prefixes[0]) throw new Error(`Failed to fetch prefixes ${prefixes}`);
      return prefixes.map((entry) => entry.prefix);
    } catch (error) {
      console.error(error);
    }
  },

  insertPrefix: async (prefix: string) => {
    try {
      const res = await runQuery<PutRequest>(`insert into prefixes (prefix) values (?)`, [prefix]);
      if ("code" in res) throw new Error(`error fetching prefixes \n${res}`);

      if (!res.affectedRows) {
        return;
      }

      return true;
    } catch (error) {
      console.error(`error inserting prefix ${error}`);
      return;
    }
  },

  insertDataToDb: async (data: Data) => {
    try {
      const purchase = await runQuery<PutRequest>(
        `insert into purchase_order (purchase_order) values (?)`,
        [data.PURCHASE_ORDER]
      );
      if ("code" in purchase) throw new Error(`error fetching prefixes \n${purchase}`);
      if (!purchase.insertId) return;

      const order = await runQuery<PutRequest>(
        `insert into order_reference (order_reference) values (?)`,
        [data.ORDER_REFERENCE]
      );
      if ("code" in order) throw new Error(`error fetching prefixes \n${order}`);
      if (!order.insertId) return;

      const skuCountIds: number[][] = [];

      for (const part of data.DATA) {
        const [sku, quantity] = await Promise.all([
          runQuery(`insert into part_number (part, description) values (?, ?)`, [part[0], part[2]]),
          runQuery(`INSERT INTO \`total_ordered\` (quantity) VALUES (?);`, [Number(part[1])]),
        ]);

        if (!sku.insertId || !quantity.insertId) throw new Error(`sku: ${sku} \n qty: ${quantity}`);
        skuCountIds.push([+sku.insertId, +quantity.insertId]);
      }

      const purchaseOrder = purchase.insertId;
      const orderRef = order.insertId;
      const poOrRef = await runQuery(
        `INSERT INTO \`po_or\` (purchase_order, order_reference) VALUES (?, ?);`,
        [purchaseOrder, orderRef]
      );
      if (!poOrRef.insertId) throw new Error(poOrRef);

      for (const part of skuCountIds) {
        const poPart = await runQuery(
          `INSERT INTO \`po_pn\` (purchase_order, part_number) VALUES (?, ?);`,
          [purchaseOrder, part[0]]
        );
        if (!poPart.insertId) throw new Error(poPart);
      }

      for (const part of skuCountIds) {
        const pnCount = await runQuery(
          `INSERT INTO \`pn_count\` (part_number, count) VALUES (?, ?);`,
          [part[0], part[1]]
        );
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
      const data = await runQuery(`SELECT purchase_order as purchaseOrder FROM purchase_order`, []);
      return [...data];
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  fetchPurchaseOrder: async (id: string): Promise<PurchaseOrder | null> => {
    try {
      let poId = await runQuery(`SELECT id FROM purchase_order WHERE purchase_order = ?`, [id]);
      if (!poId[0].id) throw new Error(`purchase_order Failed to find ${id}`);
      poId = poId[0].id;

      let refId = await runQuery(`SELECT order_reference FROM po_or WHERE purchase_order = ?`, [
        poId,
      ]);
      if (!refId[0].order_reference) throw new Error(`po_or Failed to find ${id}`);
      refId = refId[0].order_reference;

      let orderRef = await runQuery(`SELECT order_reference FROM order_reference WHERE id = ?`, [
        refId,
      ]);
      if (!orderRef[0].order_reference) throw new Error(`order_reference Failed to find ${id}`);
      orderRef = orderRef[0].order_reference;

      const partNumerRelations = await runQuery(
        `SELECT part_number FROM po_pn WHERE purchase_order = ? `,
        [poId]
      );

      const retval: PurchaseOrder = {
        purchaseOrder: id,
        orderRef,
        partNumbers: {},
      };

      for (const relation of partNumerRelations) {
        const [partNumber, qtyRelation, partsReceived] = await Promise.all([
          runQuery(`select part, description, partial_delivery from part_number where id = ?`, [
            relation.part_number,
          ]),
          runQuery(`select count from pn_count where part_number = ?`, [relation.part_number]),
          runQuery(`select amount_received from pn_received where part_number = ?`, [
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
          const qty = await runQuery(`SELECT quantity FROM total_ordered WHERE id = ?`, [
            count.count,
          ]);
          retval.partNumbers[partNumber[0].part].totalOrdered = qty[0].quantity;
          retval.partNumbers[partNumber[0].part].quantityAwaited = qty[0].quantity;
        }

        retval.partNumbers[partNumber[0].part].partsReceived = partsReceived.length
          ? []
          : undefined;

        for (const { amount_received } of partsReceived) {
          const [total] = await runQuery(
            `select amount_received from amount_received where id = ?`,
            [amount_received]
          );

          retval.partNumbers[partNumber[0].part].partsReceived?.push(total.amount_received);
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
      const inUse = await runQuery("select email from users where email = ?", [email]);
      return inUse.length;
    } catch (error) {
      console.error(error);
      return;
    }
  },
  createUser: async (email: string, password: string) => {
    try {
      const [user, token] = await Promise.all([
        runQuery("insert into users (email, password) values (?, ?)", [email, password]),
        generateToken(),
      ]);

      if (!user.insertId) throw new Error(`Failed to create new user ${user}`);
      if (!token) throw new Error(`Failed to create new user (token) ${token}`);

      const tokenId = await runQuery(`INSERT INTO tokens (token) VALUES (?)`, [token]);
      if (!tokenId.insertId) throw new Error(`Failed to create new user (token insert) ${tokenId}`);

      const relation = await runQuery(`INSERT INTO user_token (user, token) VALUES (?, ? )`, [
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
      const user = await runQuery(`SELECT password, id FROM users WHERE email = ?`, [email]);

      return user;
    } catch (error) {
      console.error("Validate login ", error);
      return;
    }
  },

  validateUserToken: async (email: string, token: string) => {
    try {
      let user = await runQuery(`Select id from users Where email = ? `, [email]);
      if (!user.length) return;
      user = user[0].id;

      let userTokenId = await runQuery(`select token from user_token where user = ?`, [user]);
      if (!userTokenId[0].token) return;
      userTokenId = userTokenId[0].token;

      let _token = await runQuery(`select token from tokens where id = ?`, [userTokenId]);
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
      const userId = await runQuery(`SELECT id from users where email = ?`, [email]);
      if (!userId[0].id) return;

      const relation = await runQuery(`select token from user_token where user = ?`, userId[0].id);
      if (!relation[0].token) return;

      const _token = await runQuery(`select token from tokens where id = ?`, [relation[0].token]);
      if (!_token[0].token) return;

      if (_token[0].token !== token) return;

      const tokenRemoved = await runQuery(
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
      const userId = await runQuery(`SELECT id from users where email = ?`, [email]);
      if (!userId[0].id) return;

      const relation = await runQuery(`select token from user_token where user = ?`, userId[0].id);
      if (!relation[0].token) return;

      await runQuery(`update tokens set token = ? where id = ?`, [token, relation[0].token]);
      return true;
    } catch (error) {
      console.error(`Failed to update user token: ${error}`);
      return;
    }
  },
  patchPartialStatus: async (order: string, name: string) => {
    type PartIds = { id: number; name: string }[];
    try {
      const id = await runQuery(`SELECT id from purchase_order WHERE purchase_order = ?`, [order]);
      if (!id[0]) throw new Error(`Failed to select id for purchase order ${order}`);
      const partIds: PartIds = await runQuery(
        `SELECT id, part as name from part_number WHERE part = ?`,
        [name]
      );

      let target;
      for (const part of partIds) {
        if (part.name.toLowerCase() === name.toLowerCase()) {
          target = part.id;
          break;
        }
      }

      const res = await runQuery(`UPDATE part_number SET partial_delivery = 1 Where id = ?`, [
        target,
      ]);
      if (!res.affectedRows)
        throw new Error(`Failed to set partial_delivery to 1 for id ${target}`);

      return true;
    } catch (error) {
      return error;
    }
  },
  addParcelsToOrder: async (parcels: number[], purchaseOrder: string, part: string) => {
    try {
      const parcelIds: number[] = [];
      for (const parcel of parcels) {
        const res = await runQuery(`insert into amount_received (amount_received) values (?)`, [
          parcel,
        ]);
        if (!res.insertId) throw new Error(`Failed to insert new parcel ${parcels}`);
        parcelIds.push(res.insertId);
      }

      const purchaseId = await runQuery("select id from purchase_order where purchase_order = ?", [
        purchaseOrder,
      ]);
      if (!purchaseId[0].id) throw new Error(`Failed to select id for purchase ${purchaseOrder}`);

      const partId = await runQuery("Select id from part_number where part = ? ", [part]);

      if (!partId[0].id) throw new Error(`Failed to select id for part_number ${part}`);

      for (const id of parcelIds) {
        const result = await runQuery(
          "insert into pn_received (part_number, amount_received) values (?,?)",
          [partId[0].id, id]
        );

        if (!result.insertId)
          throw new Error(
            `Failed to create relation between parcel and part\nParcel: ${parcels}\nPart: ${part} `
          );
      }

      return true;
    } catch (error) {
      return error;
    }
  },

  getUserRole: async (email: string) => {
    try {
      const role = await runQuery<FecthRequest>("select role from users where email =? ", [email]);
      if ("code" in role) throw new Error(`error fetching prefixes \n${role}`);
      if (!role[0].role) return;
      return role[0].role;
    } catch (error) {
      console.error(error);
      return;
    }
  },
};

module.exports = queries;
