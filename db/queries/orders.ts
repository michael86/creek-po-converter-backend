import {
  FetchPurchaseOrders,
  FetchPurchaseOrder,
  PurchaseOrder,
  PDFStructure,
  InsertDataToDb,
  PatchPartialStatus,
  AddParcelsToOrder,
} from "@types_sql/queries";
import { runQuery } from "../connection";
import { FecthRequest, PutRequest } from "@types_sql/index";

export const insertDataToDb: InsertDataToDb = async (data: PDFStructure) => {
  try {
    const purchase = await runQuery<PutRequest>(
      `insert into purchase_order (purchase_order) values (?)`,
      [data.PURCHASE_ORDER]
    );
    if ("code" in purchase) throw new Error(`error fetching prefixes \n${purchase}`);

    const order = await runQuery<PutRequest>(
      `insert into order_reference (order_reference) values (?)`,
      [data.ORDER_REFERENCE]
    );
    if ("code" in order) throw new Error(`error fetching prefixes \n${order}`);

    const skuCountIds: number[][] = [];

    for (const part of data.DATA) {
      const [sku, quantity] = await Promise.all([
        runQuery<PutRequest>(`insert into part_number (part, description) values (?, ?)`, [
          part[0],
          part[2],
        ]),
        runQuery<PutRequest>(`INSERT INTO \`total_ordered\` (quantity) VALUES (?);`, [
          Number(part[1]),
        ]),
      ]);

      if ("code" in sku)
        throw new Error(`Error adding purchase order, failed to insert sku ${sku}`);
      if ("code" in quantity)
        throw new Error(`Error adding purchase order, failed to insert quantity ${quantity}`);
      skuCountIds.push([+sku.insertId, +quantity.insertId]);
    }

    const purchaseOrder = purchase.insertId;
    const orderRef = order.insertId;
    const poOrRef = await runQuery<PutRequest>(
      `INSERT INTO \`po_or\` (purchase_order, order_reference) VALUES (?, ?);`,
      [purchaseOrder, orderRef]
    );
    if ("code" in poOrRef)
      throw new Error(`Failed to insert new PO. Relation failed ${poOrRef.message}`);

    for (const part of skuCountIds) {
      const poPart = await runQuery<PutRequest>(
        `INSERT INTO \`po_pn\` (purchase_order, part_number) VALUES (?, ?);`,
        [purchaseOrder, part[0]]
      );
      if ("code" in poPart)
        throw new Error(`Error adding purchase order, failed to insert po_or ${poPart.message}`);
    }

    for (const part of skuCountIds) {
      const pnCount = await runQuery<PutRequest>(
        `INSERT INTO \`pn_count\` (part_number, count) VALUES (?, ?);`,
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
    let poId = await runQuery<FecthRequest>(
      `SELECT id FROM purchase_order WHERE purchase_order = ?`,
      [id]
    );
    if ("code" in poId) throw new Error(`purchase_order Failed to find ${id}\n${poId.message}`);

    let refId = await runQuery<FecthRequest>(
      `SELECT order_reference FROM po_or WHERE purchase_order = ?`,
      [poId[0].id]
    );
    if ("code" in refId) throw new Error(`po_or Failed to find ${refId.message}`);

    let orderRef = await runQuery<FecthRequest>(
      `SELECT order_reference FROM order_reference WHERE id = ?`,
      [refId[0].order_reference]
    );
    if ("code" in orderRef) throw new Error(`order_reference Failed to find ${orderRef.message}`);

    const partNumerRelations = await runQuery<FecthRequest>(
      `SELECT part_number FROM po_pn WHERE purchase_order = ? `,
      [orderRef[0].order_reference]
    );
    if ("code" in partNumerRelations)
      throw new Error(`Failed to select partNumberRelations ${partNumerRelations.message}`);

    const retval: PurchaseOrder = {
      purchaseOrder: id,
      orderRef: orderRef[0].order_reference,
      partNumbers: {},
    };

    for (const relation of partNumerRelations) {
      const [partNumber, qtyRelation, partsReceived] = await Promise.all([
        runQuery<FecthRequest>(
          `select part, description, partial_delivery from part_number where id = ?`,
          [relation.part_number]
        ),
        runQuery<FecthRequest>(`select count from pn_count where part_number = ?`, [
          relation.part_number,
        ]),
        runQuery<FecthRequest>(`select amount_received from pn_received where part_number = ?`, [
          relation.part_number,
        ]),
      ]);
      if ("code" in partNumber)
        throw new Error(`Failed to select partNumber ${partNumber.message}`);
      if ("code" in qtyRelation)
        throw new Error(`Failed to select qtyRelation ${qtyRelation.message}`);
      if ("code" in partsReceived)
        throw new Error(`Failed to select partsReceived ${partsReceived.message}`);

      retval.partNumbers[partNumber[0].part] = {
        name: partNumber[0].part,
        totalOrdered: undefined,
        quantityAwaited: undefined,
        partial: +partNumber[0].partial_delivery as 1 | 0,
        description: partNumber[0].description,
        partsReceived: undefined,
      };

      for (const count of qtyRelation) {
        const qty = await runQuery<FecthRequest>(
          `SELECT quantity FROM total_ordered WHERE id = ?`,
          [count.count]
        );
        if ("code" in qty) throw new Error(`Error selecing qty ${qty.message}`);

        retval.partNumbers[partNumber[0].part].totalOrdered = +qty[0].quantity;
        // retval.partNumbers[partNumber[0].part].quantityAwaited = qty[0].quantity;
        retval.partNumbers[partNumber[0].part].quantityAwaited = [[100], [451]];
      }

      retval.partNumbers[partNumber[0].part].partsReceived = partsReceived.length ? [] : undefined;

      for (const { amount_received } of partsReceived) {
        const total = await runQuery<FecthRequest>(
          `select amount_received from amount_received where id = ?`,
          [amount_received]
        );
        if ("code" in total) throw new Error(`failed to select amount received ${total.message}`);

        retval.partNumbers[partNumber[0].part].partsReceived?.push(+total[0].amount_received);
      }
    }

    return {
      purchaseOrder: id,
      orderRef: orderRef[0].order_reference,
      partNumbers: retval.partNumbers,
    };
  } catch (error) {
    console.error(error);
    return;
  }
};
export const patchPartialStatus: PatchPartialStatus = async (order: string, name: string) => {
  type PartIds = { id: number; name: string }[];
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
