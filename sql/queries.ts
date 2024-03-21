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
};

module.exports = queries;
