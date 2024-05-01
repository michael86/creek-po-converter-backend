import {
  FetchPurchaseOrders,
  FetchPurchaseOrder,
  InsertOrderToDb,
  SetPartialStatus,
  AddParcelsToOrder,
  RemovePartFromOrder,
} from "@types_sql/queries";
import { PDFStructure, PurchaseOrder } from "types/generic";
import { runQuery } from "../connection";
import { FecthRequest, PutRequest } from "@types_sql/index";
import {
  addParcel,
  deleteAmountReceived,
  deleteOrderPartLocation,
  deletePartialStatus,
  deleteTotalOrdered,
  insertDateDue,
  insertOrderRef,
  insertParcelRelation,
  insertPartNumber,
  insertPartToPartial,
  insertPurchaseOrder,
  insertTotalOrdered,
  selectOrderReference,
  selectPartDetails,
  selectPartId,
  selectPartPartialStatus,
  selectPartRelations,
  selectPartTotalOrdered,
  selectPartTotalOrderedId,
  selectPartsReceived,
  selectPartsReceivedIds,
  selectPurchaseOrderDate,
  selectPurchaseOrderId,
  setPartialStatus,
} from "./utils";
import { selectLocationForPart } from "./locations";

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

      const due = await insertDateDue(poId, partId, part[3]);
      if (!due) throw new Error(`Failed to insert due date ${due}`);
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

    const dateCreated = await selectPurchaseOrderDate(poId);
    if (!dateCreated) throw new Error(`Failed to select date for ${id} \n${dateCreated}`);

    const orderRef = await selectOrderReference(poId);
    if (!orderRef) throw new Error(`Failed to select order ref for id ${id} \n${orderRef}`);

    const partRelations = await selectPartRelations(poId);
    if (!partRelations)
      throw new Error(`Failed to select part relations for id ${id} \n${partRelations}`);

    const retval: PurchaseOrder = {
      dateCreated,
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

      //Select Location
      const location = await selectLocationForPart(poId, +part_number);

      //Select any orders for this part
      const partsReceived = await selectPartsReceived(+part_number, poId);

      retval.partNumbers[part.name] = {
        name: part.name,
        totalOrdered: +totalOrdered,
        partial: partial as 0 | 1,
        description: part.description,
        partsReceived,
        location,
      };
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
export const patchPartialStatus: SetPartialStatus = async (order: string, name: string) => {
  try {
    const id = await selectPurchaseOrderId(order);
    if (!id) throw new Error(`Failed to select id for purchase order ${order}`);

    const partId = await selectPartId(name);
    if (!partId) throw new Error(`Failed to fetch part id ${name}`);

    const res = await setPartialStatus(id, partId);
    if (!res) throw new Error(`Failed to set partial_delivery to 1 for id ${res}`);

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
    const poId = await selectPurchaseOrderId(purchaseOrder);
    if (!poId) throw new Error(`Failed to select if for purchase order: ${purchaseOrder}`);

    const partId = await selectPartId(part);
    if (!partId) throw new Error(`Failed to select partId for order: ${part}`);

    for (const parcel of parcels) {
      const parcelId = await addParcel(parcel);
      if (!parcelId) throw new Error(`Failed to insert parcel ${parcelId}`);
      const relation = await insertParcelRelation(poId, partId, parcelId);
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
