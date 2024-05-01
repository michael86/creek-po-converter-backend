import { PutRequest } from "@types_sql/index";
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
  SelectPoDate,
  SelectDueDateRelation,
  SelectDueDate,
} from "@types_sql/queries";
import { Parcel } from "types/generic";

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
    const relation = await selectPartTotalOrderedId(poId, pnId);
    if (!relation) return;

    const qty = await runQuery<SelectTotalOrdered>(
      `SELECT quantity FROM total_ordered WHERE id = ?`,
      [relation]
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

export const selectPartTotalOrderedId = async (order: number, part: number) => {
  try {
    const id = await runQuery<SelectCountRelation>(
      `select total_ordered from po_pn_ordered where purchase_order = ? AND part_number = ?`,
      [order, part]
    );
    if ("code" in id)
      throw new Error(
        `Failed to select part total ordered for purchase order: ${order}  \npart number: ${part} \n${id.message}`
      );

    return id[0].total_ordered;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartsReceived = async (partNumber: number, purchaseOrder: number) => {
  try {
    const receivedRelations = await selectPartsReceivedIds(purchaseOrder, partNumber);
    if (!receivedRelations) return;

    const retval: Parcel[] = [];

    for (const { parcel } of receivedRelations) {
      const total = await runQuery<SelectAmountReceived>(
        `SELECT amount_received as amountReceived, UNIX_TIMESTAMP(date_created) as dateReceived FROM amount_received WHERE id = ?`,
        parcel
      );
      if ("code" in total) throw new Error(`failed to select amount received ${total.message}`);
      if (!total[0]) return;
      retval.push({
        amountReceived: +total[0].amountReceived,
        dateReceived: +total[0].dateReceived,
      });
    }

    return retval;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectDateDue = async (partNumber: number, purchaseOrder: number) => {
  try {
    const dueDateRelation = await runQuery<SelectDueDateRelation>(
      `SELECT due_date FROM po_pn_due WHERE purchase_order = ? AND part_number = ?`,
      [purchaseOrder, partNumber]
    );

    if ("code" in dueDateRelation)
      throw new Error(
        `Error selecting due date relation for order: ${purchaseOrder} \nPart: ${partNumber} \n${dueDateRelation.message}`
      );

    const dueDate = await runQuery<SelectDueDate>(
      `SELECT date_due as dateDue from date_due WHERE id = ? `,
      [dueDateRelation[0].due_date]
    );

    if ("code" in dueDate) throw new Error(`Failed to select due date ${dueDate.message}`);

    return dueDate[0].dateDue;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartsReceivedIds = async (order: number, part: number) => {
  try {
    const receivedRelations = await runQuery<SelectCount>(
      `select parcel from po_pn_parcel where purchase_order = ? AND part_number = ?`,
      [order, part]
    );

    if ("code" in receivedRelations)
      throw new Error(`Failed to select partsReceived ${receivedRelations.message}`);

    if (!receivedRelations.length) return;

    return receivedRelations;
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
    return +id[0].id;
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

export const insertDateDue = async (purchase: number, part: number, due: string) => {
  try {
    const res = await runQuery<PutRequest>(
      `INSERT INTO date_due (date_due) VALUES (STR_TO_DATE(?, '%d/%m/%Y'))`,
      [due]
    );
    if ("code" in res) throw new Error(`Failed to insert due date \n${res.message}`);

    const relation = await runQuery<PutRequest>(
      `INSERT INTO po_pn_due (purchase_order, part_number, due_date) VALUES (?,?, ?)`,
      [purchase, part, res.insertId]
    );

    if ("code" in relation)
      throw new Error(`Failed to insert due date relation \n${relation.message}`);

    return true;
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

export const setPartialStatus = async (purchaseId: number, partId: number) => {
  try {
    const patched = await runQuery<PutRequest>(
      `UPDATE po_pn_partial SET partial = 1 WHERE purchase_order = ? AND part_number =? `,
      [purchaseId, partId]
    );

    if ("code" in patched || !patched.affectedRows)
      throw new Error(
        `Failed to update partial status for order ${purchaseId} \nPart: ${partId} \n${patched}`
      );

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const addParcel = async (amount: number) => {
  try {
    const res = await runQuery<PutRequest>(
      `insert into amount_received (amount_received) values (?)`,
      [amount]
    );

    if ("code" in res) throw new Error(`Failed to insert new parcel ${res.message}`);

    return res.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertParcelRelation = async (poId: number, pnId: number, parcelId: number) => {
  try {
    const res = await runQuery<PutRequest>(
      `INSERT INTO po_pn_parcel (purchase_order, part_number, parcel) VALUES (?,?,?)`,
      [poId, pnId, parcelId]
    );
    if ("code" in res) throw new Error(`Failed to create new relation for parcel ${res.message}`);
    return res.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPurchaseOrderDate = async (id: number) => {
  try {
    const res = await runQuery<SelectPoDate>(
      `SELECT UNIX_TIMESTAMP(date_created) as dateCreated from purchase_order WHERE id = ?`,
      [id]
    );

    if ("code" in res || !res[0])
      throw new Error(
        `Failed to create new relation for parcel ${"code" in res ? res.message : res}`
      );

    return res[0].dateCreated;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteOrderPartLocation = async (order: number, part: number) => {
  try {
    const res = await runQuery<PutRequest>(
      `DELETE FROM po_pn_location WHERE purchase_order = ? AND part_number = ?`,
      [order, part]
    );

    if ("code" in res)
      throw new Error(
        `Error deleting part location from purchase order: ${order} \npart: ${part} \n${res.message}`
      );

    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteTotalOrdered = async (id: number, order: number, part: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM total_ordered WHERE id = ?`, [id]);
    if ("code" in res)
      throw new Error(`Failed to delete total ordered for id${id} \n${res.message}`);

    const relationRes = await runQuery<PutRequest>(
      `DELETE FROM po_pn_ordered WHERE purchase_order = ? AND part_number = ?`,
      [order, part]
    );
    if ("code" in relationRes)
      throw new Error(
        `Failed to delete total ordered relation for id${id} \n${relationRes.message}`
      );

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deletePartialStatus = async (order: number, part: number) => {
  try {
    const res = await runQuery<PutRequest>(
      `DELETE FROM po_pn_partial WHERE purchase_order = ? AND part_number = ?`,
      [order, part]
    );
    if ("code" in res)
      throw new Error(
        `Error deleting partial status for order: ${order} \npart: ${part} \n${res.message}`
      );

    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteAmountReceived = async (parcelIds: SelectCount, order: number, part: number) => {
  try {
    for (const { parcel } of parcelIds) {
      const res = await runQuery<PutRequest>(`DELETE FROM amount_received WHERE id = ?`, [+parcel]);
      if ("code" in res)
        throw new Error(`Error deleting amount received id: ${parcel} \n${res.message}`);
    }
    const res = await runQuery<PutRequest>(
      `DELETE FROM po_pn_parcel WHERE purchase_order = ? AND part_number = ?`,
      [order, part]
    );
    if ("code" in res)
      throw new Error(
        `Error deleting amount received relation order: ${order} part: ${part} \n${res.message}`
      );

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};
