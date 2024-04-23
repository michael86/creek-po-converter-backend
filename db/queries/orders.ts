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
  insertPurchaseOrder,
  selectOrderReference,
  selectPartDetails,
  selectPartRelations,
  selectPartTotalOrdered,
  selectPartsReceived,
  selectPurchaseOrderId,
} from "./utils";

export const insertOrderToDb: InsertOrderToDb = async (data: PDFStructure) => {
  try {
    const poId = await insertPurchaseOrder(data.PURCHASE_ORDER);
    if (!poId) throw new Error(`Failed to insert purchase order ${data} \n${poId}`);

    const orId = await insertOrderRef(data.ORDER_REFERENCE, poId);
    if (!orId) throw new Error(`Failed to insert purchase order ${data} \n${orId}`);

    const skuCountIds: number[][] = [];

    for (const part of data.DATA) {
      const partId = await insertPartNumber(part);
      if (!partId) throw new Error(`Failed to insert part ${part[0]} \n${partId}`);

      //Upto refactoring here

      const [quantity] = await Promise.all([
        runQuery<PutRequest>(`INSERT INTO total_ordered (quantity) VALUES (?);`, [Number(part[1])]),
      ]);

      if ("code" in quantity)
        throw new Error(`Error adding purchase order, failed to insert quantity ${quantity}`);
      skuCountIds.push([partId, +quantity.insertId]);
    }

    for (const part of skuCountIds) {
      const poPart = await runQuery<PutRequest>(
        `INSERT INTO po_pn (purchase_order, part_number) VALUES (?, ?);`,
        [poId, part[0]]
      );
      if ("code" in poPart)
        throw new Error(`Error adding purchase order, failed to insert po_or ${poPart.message}`);
    }

    for (const part of skuCountIds) {
      const pnCount = await runQuery<PutRequest>(
        `INSERT INTO \`pn_ordered\` (part_number, ordered) VALUES (?, ?);`,
        [part[0], part[1]]
      );
      if ("code" in pnCount)
        throw new Error(`Error adding purchase order, failed to insert sku ${pnCount.message}`);
    }

    return true;
  } catch (error) {
    if (
      (error instanceof Error && error.message.includes("ER_DUP_ENTRY")) ||
      (typeof error === "string" && error.includes("ER_DUP_ENTRY"))
    ) {
      return "ER_DUP_ENTRY";
    }
    console.error(`failed to insert data to db `, error);
    return;
  }
};

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
    for (const relation of partRelations) {
      //Select details such as description, partial order and so on
      const part = await selectPartDetails(relation.part_number);
      if (!part) throw new Error(`Failed to select part details for ${id} \n${part}`);

      //Select the total amount ordered
      const totalOrdered = await selectPartTotalOrdered(relation.part_number);

      if (!totalOrdered)
        throw new Error(`Failed to select total ordered for ${id} \n${totalOrdered}`);

      const partsReceived = await selectPartsReceived(relation.part_number, poId);

      retval.partNumbers[part.name] = {
        name: part.name,
        totalOrdered: +totalOrdered,
        partial: +part.partial_delivery as 0 | 1,
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
