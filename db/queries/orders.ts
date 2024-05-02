import {
  FetchPurchaseOrders,
  FetchPurchaseOrder,
  InsertOrderToDb,
  SetPartialStatus,
  AddParcelsToOrder,
  RemovePartFromOrder,
  SelectPartialId,
} from "@types_sql/queries";
import { PDFStructure, PurchaseOrder } from "types/generic";
import { runQuery } from "../connection";
import { FecthRequest } from "@types_sql/index";
import {
  addParcel,
  createLineRelation,
  deleteAmountReceived,
  deleteOrderPartLocation,
  deletePartialStatus,
  deleteTotalOrdered,
  insertDateDue,
  insertDescription,
  insertOrderLineRelation,
  insertOrderRef,
  insertParcelRelation,
  insertPartNumber,
  insertPartToPartial,
  insertPurchaseOrder,
  insertTotalOrdered,
  selectDateDue,
  selectDescription,
  selectLineRelations,
  selectOrderReference,
  selectPartDetails,
  selectPartId,
  selectPartPartialStatus,
  selectPartTotalOrdered,
  selectPartTotalOrderedId,
  selectPartsReceived,
  selectPartsReceivedIds,
  selectPoLines,
  selectPurchaseOrderDate,
  selectPurchaseOrderId,
  setPartialStatus,
} from "./utils";
import { selectLocation } from "./locations";

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

      const quantityId = await insertTotalOrdered(part[1]);
      if (!quantityId) throw new Error(`Failed to insert part quantity ${part}`);

      const partialId = await insertPartToPartial();
      if (!partialId) throw new Error(`Failed to insert partial ${partialId}`);

      const dueId = await insertDateDue(part[3]);
      if (!dueId) throw new Error(`Failed to insert due date ${dueId}`);

      const descId = await insertDescription(part[2]);
      if (!descId) throw new Error(`Failed to insert new description \n${descId}`);

      const lineId = await createLineRelation(partId, descId, quantityId, dueId, partialId);
      if (!lineId) throw new Error(`Failed to insert create line relation ${lineId}`);

      const orderRelation = await insertOrderLineRelation(poId, lineId);
      if (!orderRelation) throw new Error(`Failed to insert create line relation ${orderRelation}`);
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

    const dateCreated = await selectPurchaseOrderDate(poId);
    if (!dateCreated) throw new Error(`Failed to select date for ${id} \n${dateCreated}`);

    const lines = await selectPoLines(poId);
    if (!lines) throw new Error(`No lines for purchase order: ${poId}`);

    const retval: PurchaseOrder = {
      dateCreated,
      purchaseOrder: id,
      orderRef: orderRef,
      partNumbers: [],
    };

    for (const { line } of lines) {
      const lineRelations = await selectLineRelations(line);
      if (!lineRelations)
        throw new Error(`Error selecting line relations for order: ${id} and line: ${line}`);

      const part = await selectPartDetails(lineRelations.partId);
      if (!part) throw new Error(`failed to select part name`);

      const dateDue = await selectDateDue(lineRelations.dueDateId);
      if (!dateDue) throw new Error(`failed to select date due`);

      const totalOrdered = await selectPartTotalOrdered(lineRelations.totalOrderedId);
      if (!totalOrdered) throw new Error(`failed to select total ordered`);

      const partial = await selectPartPartialStatus(lineRelations.partialId);
      if (typeof partial !== "number") throw new Error(`Failed to select partial`);

      const description = await selectDescription(lineRelations.descId);
      if (!description) throw new Error(`Failed to select description`);

      const location =
        lineRelations.locationId !== null
          ? await selectLocation(lineRelations.locationId)
          : lineRelations.locationId;

      const partsReceviedIds = await selectPartsReceivedIds(line);

      retval.partNumbers.push({
        name: part.name,
        dateDue,
        totalOrdered,
        partial: partial as 0 | 1,
        description,
        partsReceived: !partsReceviedIds?.length ? [] : await selectPartsReceived(partsReceviedIds),
        location,
        lineId: line,
      });
    }

    return retval;
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
export const patchPartialStatus: SetPartialStatus = async (id: number) => {
  try {
    console.log("id ", id);
    const res = await runQuery<SelectPartialId>(
      `SELECT partial_id as partialId FROM \`lines\` WHERE id = ?`,
      [id]
    );
    if ("code" in res) throw new Error(`Failed to select partial_id from lines ${res.message}`);

    console.log(res);

    await setPartialStatus(res[0].partialId);

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

export const addParcelsToOrder: AddParcelsToOrder = async (parcels, index) => {
  try {
    for (const parcel of parcels) {
      const parcelId = await addParcel(parcel);
      if (!parcelId) throw new Error(`Failed to insert parcel ${parcelId}`);
      const relation = await insertParcelRelation(index, parcelId);
      if (!relation) throw new Error(`Failed to insert parcel relation ${relation}`);
    }

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const removePartFromOrder: RemovePartFromOrder = async (order, part) => {
  try {
    const orderId = await selectPurchaseOrderId(order);
    if (!orderId) return;

    const partId = await selectPartId(part);
    if (!partId) return;

    const totalOrderedId = await selectPartTotalOrderedId(orderId, partId);
    if (!totalOrderedId) return;

    await deleteTotalOrdered(Number(totalOrderedId), orderId, partId);
    await deletePartialStatus(orderId, partId);
    await deleteOrderPartLocation(orderId, partId); //Dont check if deleted as location may not be assigned so no rows affected

    const parcelIds = await selectPartsReceivedIds(orderId, partId);
    if (!parcelIds?.length) return true;

    const deletedParcels = await deleteAmountReceived(parcelIds, orderId, partId);

    return true;
  } catch (error) {
    console.error(error);
    return;
  }
};
