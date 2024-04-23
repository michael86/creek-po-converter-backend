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
} from "@types_sql/queries";

export const selectPurchaseOrderId = async (purchaseOrder: string) => {
  try {
    let poId = await runQuery<SelectPoId>(
      `SELECT id FROM purchase_order WHERE purchase_order = ?`,
      [purchaseOrder]
    );

    if ("code" in poId)
      throw new Error(`Failed to select purchase order id for ${purchaseOrder} \n${poId.message} `);

    return poId[0].id;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectOrderReference = async (id: string) => {
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

export const selectPartRelations = async (id: string) => {
  try {
    const partNumberRelations = await runQuery<SelectPartRelation>(
      `SELECT part_number FROM po_pn WHERE purchase_order = ? `,
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

export const selectPartDetails = async (partNumber: string) => {
  try {
    const details = await runQuery<SelectPart>(
      `select part as name, description, partial_delivery from part_number where id = ?`,
      partNumber
    );
    if ("code" in details) throw new Error(`Failed to select part details ${details.message}`);
    return { ...details[0] };
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartTotalOrdered = async (id: string) => {
  try {
    const countRelation = await runQuery<SelectCountRelation>(
      `select ordered from pn_ordered where part_number = ?`,
      id
    );
    if ("code" in countRelation)
      throw new Error(`Failed to select part total ordered for ${id} \n${countRelation.message}`);

    const qty = await runQuery<SelectTotalOrdered>(
      `SELECT quantity FROM total_ordered WHERE id = ?`,
      [countRelation[0].ordered]
    );
    if ("code" in qty)
      throw new Error(
        `Error selecing total ordered for ${countRelation[0].ordered} \n${qty.message}`
      );

    return qty[0].quantity;
  } catch (error) {
    console.error(error);
    return;
  }
};

export const selectPartsReceived = async (partNumber: string, purchaseOrder: string) => {
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
