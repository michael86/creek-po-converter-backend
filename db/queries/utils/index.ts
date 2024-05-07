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
  SelectOrderLines,
  SelectLineRelations,
  SelectDescription,
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

export const selectPoLines = async (id: number) => {
  try {
    const lines = await runQuery<SelectOrderLines>(
      "SELECT `line` FROM `order_lines` WHERE `order` = ?",
      [id]
    );
    if ("code" in lines) throw new Error(`Error selecting order (${id}) lines\n${lines.message}`);

    return lines;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectLineRelations = async (id: number) => {
  try {
    const relations = await runQuery<SelectLineRelations>(
      `SELECT part_id as partId,
       description_id as descId,
       total_ordered_id as totalOrderedId,
       due_date_id as dueDateId, 
       partial_id as partialId,
       location_id as locationId from \`lines\` where id = ?`,
      [id]
    );

    if ("code" in relations) throw new Error(relations.message);
    return relations[0];
  } catch (error) {
    console.error(error);
  }
};

export const deleteLineRelations = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM \`lines\` WHERE id = ? `, id);
    if ("code" in res) throw new Error(`Error deleting line ${res.message}`);
    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteOrderLine = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM \`order_lines\` WHERE line = ? `, id);
    if ("code" in res) throw new Error(`Error deleting line ${res.message}`);
    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteDescription = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM \`descriptions\` WHERE id = ?`, [id]);
    if ("code" in res) throw new Error(`Error deleting description \n${res.message}`);

    return res.affectedRows;
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

export const selectPartTotalOrdered = async (id: number) => {
  try {
    const res = await runQuery<SelectTotalOrdered>(
      `SELECT quantity FROM total_ordered WHERE id = ?`,
      [id]
    );

    if ("code" in res) throw new Error(`Error selecing total ordered ${res.message}`);

    return +res[0].quantity;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartTotalOrderedId = async (order: number, part: number) => {
  try {
    const ids = await runQuery<SelectCountRelation>(
      `select total_ordered from po_pn_ordered where purchase_order = ? AND part_number = ?`,
      [order, part]
    );
    if ("code" in ids)
      throw new Error(
        `Failed to select part total ordered for purchase order: ${order}  \npart number: ${part} \n${ids.message}`
      );

    return ids;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartsReceived = async (receviedIds: SelectCountRelation) => {
  try {
    const retval: Parcel[] = [];

    for (const { receivedId } of receviedIds) {
      const total = await runQuery<SelectAmountReceived>(
        `SELECT amount_received as amountReceived, UNIX_TIMESTAMP(date_created) as dateReceived FROM amount_received WHERE id = ?`,
        receivedId
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

export const selectDateDue = async (id: number) => {
  try {
    const res = await runQuery<SelectDueDateRelation>(
      `SELECT UNIX_TIMESTAMP(date_due) as dueDate FROM date_due WHERE id = ?`,
      [id]
    );

    if ("code" in res) throw new Error(`Error selecting due date \n${res.message}`);

    return res[0].dueDate;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartsReceivedIds = async (lineId: number) => {
  try {
    const res = await runQuery<SelectCountRelation>(
      `SELECT received_id AS receivedId FROM line_received WHERE line_id =? `,
      [lineId]
    );

    if ("code" in res) throw new Error(`Failed to select partsReceived ${res.message}`);

    if (!res.length) return;

    return res;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteParcel = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM \`amount_received\` WHERE id = ?`, id);
    if ("code" in res) throw new Error(`Failed to delete parcel from order \n${res.message}`);

    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteParcelRelations = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM \`line_received\` WHERE line_id = ?`, id);
    if ("code" in res) throw new Error(`Failed to delete parcel relations ${res.message}`);
    return true;
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
        return id;
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

export const insertTotalOrdered = async (totalOrdered: string) => {
  try {
    const quantity = await runQuery<PutRequest>(
      `INSERT INTO total_ordered (quantity) VALUES (?);`,
      totalOrdered
    );

    if ("code" in quantity)
      throw new Error(`Error adding purchase order, failed to insert quantity ${quantity.message}`);

    return quantity.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertPartToPartial = async () => {
  try {
    const partial = await runQuery<PutRequest>(
      `INSERT INTO partial (partial_status) VALUES (0);`,
      ""
    );
    if ("code" in partial) throw new Error(`Failed to insert partial ${partial.message}`);
    return partial.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertDateDue = async (due: string) => {
  try {
    const res = await runQuery<PutRequest>(
      `INSERT INTO date_due (date_due) VALUES (STR_TO_DATE(?, '%d/%m/%Y'))`,
      [due]
    );
    if ("code" in res) throw new Error(`Failed to insert due date \n${res.message}`);

    return res.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const createLineRelation = async (
  part: number,
  description: number,
  total: number,
  due: number,
  partialId: number
) => {
  try {
    const res = await runQuery<PutRequest>(
      `INSERT INTO \`lines\` (part_id, description_id, total_ordered_id, due_date_id, partial_id) VALUES (?,?,?,?,?)`,
      [part, description, total, due, partialId]
    );
    if ("code" in res) throw new Error(`Error creating line relation \n${res.message}`);
    return res.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertOrderLineRelation = async (orderId: number, lineId: number) => {
  try {
    const res = await runQuery<PutRequest>(
      "INSERT INTO `order_lines` (`order`, `line`) VALUES (?,?)",
      [orderId, lineId]
    );
    if ("code" in res) throw new Error(`Error creating order line relation \n${res.message}`);
    return res.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const insertDescription = async (description: string) => {
  try {
    const res = await runQuery<PutRequest>(`INSERT INTO descriptions (description) VALUES (?)`, [
      description,
    ]);
    if ("code" in res) throw new Error(`Failed to insert description ${res.message}`);

    return res.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartPartialStatus = async (id: number) => {
  try {
    const res = await runQuery<SelectPartial>(
      `SELECT partial_status as partial FROM partial WHERE id = ?`,
      [id]
    );

    if ("code" in res) throw new Error(`Failed to select partial_status ${res.message}`);

    return res[0].partial;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectDescription = async (id: number) => {
  try {
    const res = await runQuery<SelectDescription>(
      `SELECT description from descriptions WHERE id = ?`,
      [id]
    );
    if ("code" in res) throw new Error(`Failed to select description ${res.message}`);
    return res[0].description;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const setPartialStatus = async (id: number) => {
  try {
    const patched = await runQuery<PutRequest>(
      `UPDATE partial SET partial_status = 1 WHERE id = ?`,
      [id]
    );

    if ("code" in patched || !patched.affectedRows)
      throw new Error(`Failed to update partial status for id: ${id} \n${patched.message}`);

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

export const insertParcelRelation = async (lineId: number, parcelId: number) => {
  try {
    const res = await runQuery<PutRequest>(
      `INSERT INTO line_received (line_id, received_id) VALUES (?,?)`,
      [lineId, parcelId]
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

export const deleteTotalOrdered = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM total_ordered WHERE id = ?`, [id]);
    if ("code" in res)
      throw new Error(`Failed to delete total ordered for id${id} \n${res.message}`);

    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deleteDueDate = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM \`date_due\` WHERE id = ?`, [id]);
    if ("code" in res)
      throw new Error(`Failed to delete total ordered for id${id} \n${res.message}`);

    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const deletePartialStatus = async (id: number) => {
  try {
    const res = await runQuery<PutRequest>(`DELETE FROM \`partial\` WHERE id = ?`, [id]);
    if ("code" in res) throw new Error(`Error deleting partial status \n${res.message}`);

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
