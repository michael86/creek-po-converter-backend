import {
  FetchPurchaseOrders,
  FetchPurchaseOrder,
  InsertOrderToDb,
  PatchPartialStatus,
  AddParcelsToOrder,
} from "@types_sql/queries";
import { PDFStructure, PurchaseOrder } from "types/generic";
import { runQuery } from "../connection";
import { FecthRequest, PutRequest } from "@types_sql/index";
import {
  insertOrderRef,
  insertPartNumber,
  insertPartToPartial,
  insertPurchaseOrder,
  insertTotalOrdered,
  selectOrderReference,
  selectPartDetails,
  selectPartPartialStatus,
  selectPartRelations,
  selectPartTotalOrdered,
  selectPartsReceived,
  selectPurchaseOrderId,
} from "./utils";

/**
 *
 * Will insert the data extracted from a purchase order into the database
 *
 * @param data PDFstructure
 * @returns
 */
export const insertOrderToDb: InsertOrderToDb = async (data: PDFStructure) => {
  try {
    const poId = await insertPurchaseOrder(data.PURCHASE_ORDER);
    if (!poId) throw new Error(`Failed to insert purchase order ${data} \n${poId}`);
    if (poId === "ER_DUP_ENTRY") return poId;

    const orId = await insertOrderRef(data.ORDER_REFERENCE, poId);
    if (!orId) throw new Error(`Failed to insert purchase order ${data} \n${orId}`);

    for (const part of data.DATA) {
      const partId = await insertPartNumber(part);
      if (!partId) throw new Error(`Failed to insert part ${part[0]} \n${partId}`);

      const quantity = await insertTotalOrdered(part[1], poId, partId);
      if (!quantity) throw new Error(`Failed to insert part quantity ${part}`);

      const partial = await insertPartToPartial(poId, partId);
      if (!partial) throw new Error(`Failed to insert partial ${partial}`);
    }
    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 * Will return an array of all the purchase orders
 * @returns string[]
 */
export const fetchPurchaseOrders: FetchPurchaseOrders = async () => {
  try {
    const data = await runQuery<FecthRequest>(
      `SELECT purchase_order as purchaseOrder FROM purchase_order`,
      []
    );

    if ("code" in data) throw new Error(`Failed to fetchPurchaseOrder ${data.message}`);

    return data.map((p) => p.purchaseOrder);
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 * Will return a specific purchase order based on the purchase order name
 * @param id - typically the purchase order name
 * @returns PurchaseOrder | void
 */
export const fetchPurchaseOrder: FetchPurchaseOrder = async (id) => {
  try {
    const poId = await selectPurchaseOrderId(id);
    if (!poId) throw new Error(`Failed to select purchase order id for ${id} \n${poId}`);

    const orderRef = await selectOrderReference(poId);
    if (!orderRef) throw new Error(`Failed to select order ref for id ${id} \n${orderRef}`);

    const partRelations = await selectPartRelations(poId);
    if (!partRelations)
      throw new Error(`Failed to select part relations for id ${id} \n${partRelations}`);

    const retval: PurchaseOrder = {
      purchaseOrder: id,
      orderRef: orderRef,
      partNumbers: {},
    };

    //Begin filling out the order part status
    for (const { part_number } of partRelations) {
      //Select details such as description, partial order and so on
      const part = await selectPartDetails(+part_number);
      if (!part) throw new Error(`Failed to select part details for ${id} \n${part}`);

      //Select the total amount ordered
      const totalOrdered = await selectPartTotalOrdered(poId, +part_number);
      if (!totalOrdered)
        throw new Error(`Failed to select total ordered for ${id} \n${totalOrdered}`);

      //Select if partial
      const partial = await selectPartPartialStatus(poId, +part_number);
      if (typeof partial !== "number")
        throw new Error(`Failed to select part partial status for ${id} \n${partial}`);

      //Select any orders for this part
      const partsReceived = await selectPartsReceived(+part_number, poId);

      retval.partNumbers[part.name] = {
        name: part.name,
        totalOrdered: +totalOrdered,
        partial: partial as 0 | 1,
        description: part.description,
        partsReceived,
      };
    }

    return {
      purchaseOrder: id,
      orderRef: orderRef,
      partNumbers: retval.partNumbers,
    };
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 *
 * Will udpate a parts status surrounding partial status
 *
 * @param order string - purchase order name
 * @param name stirng - partnumber
 * @returns
 */
export const patchPartialStatus: PatchPartialStatus = async (order: string, name: string) => {
  try {
    const id = await runQuery<FecthRequest>(
      `SELECT id from purchase_order WHERE purchase_order = ?`,
      [order]
    );
    if ("code" in id) throw new Error(`Failed to select id for purchase order ${id.message}`);

    const partIds = await runQuery<FecthRequest>(
      `SELECT id, part as name from part_number WHERE part = ?`,
      [name]
    );
    if ("code" in partIds) throw new Error(`Failed to fetch partIds ${partIds.message}`);

    let target;
    for (const part of partIds) {
      if (part.name.toLowerCase() === name.toLowerCase()) {
        target = part.id;
        break;
      }
    }
    if (!target) throw new Error(`Failed to assign target to part`);

    const res = await runQuery<PutRequest>(
      `UPDATE part_number SET partial_delivery = 1 Where id = ?`,
      [target]
    );
    if ("code" in res) throw new Error(`Failed to set partial_delivery to 1 for id ${res.message}`);

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};

/**
 *
 * Will add new parcels to a selected purchase orders part number
 *
 * @param parcels number[]
 * @param purchaseOrder string
 * @param part string
 * @returns true | void
 */

export const addParcelsToOrder: AddParcelsToOrder = async (
  parcels: number[],
  purchaseOrder: string,
  part: string
) => {
  try {
    const parcelIds: number[] = [];
    for (const parcel of parcels) {
      const res = await runQuery<PutRequest>(
        `insert into amount_received (amount_received) values (?)`,
        [parcel]
      );

      if ("code" in res) throw new Error(`Failed to insert new parcel ${res.message}`);
      parcelIds.push(res.insertId);
    }

    const purchaseId = await runQuery<FecthRequest>(
      "select id from purchase_order where purchase_order = ?",
      [purchaseOrder]
    );

    if ("code" in purchaseId)
      throw new Error(`Failed to select id from purchase order ${purchaseId.message}`);

    const partId = await runQuery<FecthRequest>("Select id from part_number where part = ? ", [
      part,
    ]);

    if ("code" in partId) throw new Error(`Failed to select id for part_number ${partId.message}`);

    for (const id of parcelIds) {
      const result = await runQuery<PutRequest>(
        "insert into pn_received (part_number, amount_received) values (?,?)",
        [partId[0].id, id]
      );

      if ("code" in result)
        throw new Error(
          `Failed to create relation between parcel and part\nParcel: ${parcels}\nPart: ${part} `
        );
    }

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};
