import { FecthRequest, PutRequest } from "@types_sql/index";
import { runQuery } from "../../connection";
import {
  SelectPoId,
  SelectOrderReference,
  SelectPartRelation,
  SelectPart,
  SelectCountRelation,
  SelectTotalOrdered,
  SelectCount,
  SelectAmountReceived,
  SelectPartId,
  SelectPartial,
} from "@types_sql/queries";

export const selectPurchaseOrderId = async (purchaseOrder: string) => {
  try {
    let poId = await runQuery<SelectPoId>(
      `SELECT id FROM purchase_order WHERE purchase_order = ?`,
      [purchaseOrder]
    );

    if ("code" in poId)
      throw new Error(`Failed to select purchase order id for ${purchaseOrder} \n${poId.message} `);

    return +poId[0].id;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectOrderReference = async (id: number) => {
  try {
    const refId = await runQuery<SelectOrderReference>(
      `SELECT order_reference FROM po_or WHERE purchase_order = ?`,
      [id]
    );

    if ("code" in refId)
      throw new Error(`Failed to select order reference for ${id} \n${refId.message}`);

    const orderRef = await runQuery<SelectOrderReference>(
      `SELECT order_reference FROM order_reference WHERE id = ?`,
      [refId[0].order_reference]
    );
    if ("code" in orderRef)
      throw new Error(
        `Failed to select order refence from order refence, id was ${id} \n${orderRef.message}`
      );

    return orderRef[0].order_reference;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartRelations = async (id: number) => {
  try {
    const partNumberRelations = await runQuery<SelectPartRelation>(
      `SELECT part_number FROM po_pn_ordered WHERE purchase_order = ? `,
      [id]
    );

    if ("code" in partNumberRelations)
      throw new Error(`Failed to select partNumberRelations ${partNumberRelations.message}`);

    return partNumberRelations;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartDetails = async (partNumber: number) => {
  try {
    const details = await runQuery<SelectPart>(
      `select part as name, description from part_number where id = ?`,
      partNumber
    );
    if ("code" in details) throw new Error(`Failed to select part details ${details.message}`);
    return { ...details[0] };
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartTotalOrdered = async (poId: number, pnId: number) => {
  try {
    const countRelation = await runQuery<SelectCountRelation>(
      `select total_ordered from po_pn_ordered where part_number = ? AND purchase_order = ?`,
      [pnId, poId]
    );
    if ("code" in countRelation)
      throw new Error(
        `Failed to select part total ordered for purchase order: ${poId}  \npart number: ${pnId} \n${countRelation.message}`
      );

    const qty = await runQuery<SelectTotalOrdered>(
      `SELECT quantity FROM total_ordered WHERE id = ?`,
      [countRelation[0].total_ordered]
    );

    if ("code" in qty)
      throw new Error(
        `Error selecing total ordered for purchase order: ${poId}  \npart number: ${pnId} \n${qty.message}`
      );

    return qty[0].quantity;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartsReceived = async (partNumber: number, purchaseOrder: number) => {
  try {
    const receviedRelations = await runQuery<SelectCount>(
      `select parcel from po_pn_parcel where part_number = ? AND purchase_order = ?`,
      [partNumber, purchaseOrder]
    );

    if ("code" in receviedRelations)
      throw new Error(`Failed to select partsReceived ${receviedRelations.message}`);

    if (!receviedRelations.length) return [];

    const retval: number[] = [];
    for (const { amountReceived } of receviedRelations) {
      const total = await runQuery<SelectAmountReceived>(
        `select amount_received as amountReceived from amount_received where id = ?`,
        amountReceived
      );
      if ("code" in total) throw new Error(`failed to select amount received ${total.message}`);
      retval.push(+total[0].amountReceived);
    }

    return retval;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertPurchaseOrder = async (po: string) => {
  try {
    const purchase = await runQuery<PutRequest>(
      `insert into purchase_order (purchase_order) values (?)`,
      po
    );

    if ("code" in purchase) {
      if (purchase.code === "ER_DUP_ENTRY") {
        return purchase.code;
      }

      throw new Error(`error inserting purchase_order \n${purchase}`);
    }

    return purchase.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertOrderRef = async (or: string, po: number) => {
  try {
    const order = await runQuery<PutRequest>(
      `insert into order_reference (order_reference) values (?)`,
      or
    );

    if ("code" in order) throw new Error(`error inserting purchase_order \n${order}`);

    const poOrRef = await runQuery<PutRequest>(
      `INSERT INTO po_or (purchase_order, order_reference) VALUES (?, ?);`,
      [po, order.insertId]
    );
    if ("code" in poOrRef)
      throw new Error(`Failed to insert new PO. Relation failed ${poOrRef.message}`);

    return order.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartId = async (part: string) => {
  try {
    const id = await runQuery<SelectPartId>(`SELECT id from part_number where part = ?`, part);
    if ("code" in id) throw new Error(`Failed to select id for part ${part}`);
    return id[0].id;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 *
 * Will insert the part and return the insertId, if dupe entry, will return the id of that dupe entry
 *
 * @param part [name, qty, description]
 * @returns
 */
export const insertPartNumber = async (part: [string, string, string]) => {
  try {
    const partNumber = await runQuery<PutRequest>(
      `insert into part_number (part, description) values (?, ?)`,
      [part[0], part[2]]
    );

    if ("code" in partNumber) {
      if (partNumber.code === "ER_DUP_ENTRY") {
        const id = await selectPartId(part[0]);
        if (!id) throw new Error(`Failed to find id for ${part[0]}`);
        return +id;
      }

      throw new Error(
        `Error inserting part, failed to insert part ${part[0]} \n${partNumber.message}`
      );
    }

    return partNumber.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertTotalOrdered = async (
  totalOrdered: string,
  purchaseOrder: number,
  partId: number
) => {
  try {
    const quantity = await runQuery<PutRequest>(
      `INSERT INTO total_ordered (quantity) VALUES (?);`,
      totalOrdered
    );

    if ("code" in quantity)
      throw new Error(`Error adding purchase order, failed to insert quantity ${quantity.message}`);

    const pnCount = await runQuery<PutRequest>(
      `INSERT INTO \`po_pn_ordered\` (purchase_order, part_number, total_ordered) VALUES (?, ?,? );`,
      [purchaseOrder, partId, quantity.insertId]
    );
    if ("code" in pnCount)
      throw new Error(`Error adding purchase order, failed to insert sku ${pnCount.message}`);
    return quantity.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertPartToPartial = async (purchase: number, part: number) => {
  try {
    const partial = await runQuery<PutRequest>(
      `INSERT INTO po_pn_partial (purchase_order, part_number) VALUES (?, ?);`,
      [purchase, part]
    );
    if ("code" in partial)
      throw new Error(`Failed to insert part ${part} into partial for order ${purchase}`);
    return partial.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartPartialStatus = async (poId: number, pnId: number) => {
  try {
    const partial = await runQuery<SelectPartial>(
      `SELECT partial FROM po_pn_partial WHERE purchase_order = ? AND part_number = ?`,
      [poId, pnId]
    );

    if ("code" in partial)
      throw new Error(
        `Failed to select partial status for purchase order: ${poId} \nPart Number: ${pnId}`
      );

    return partial[0].partial;
  } catch (error) {
    console.error(error);
    return;
  }
};
