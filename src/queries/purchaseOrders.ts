import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { SelectPoByUuid, SelectPoNames } from "../types/queries";
import { Deliveries } from "../types/purchase_orders";

export const deletePurchaseOrderById = async (uuid: string): Promise<boolean> => {
  try {
    const [result] = await pool.execute<ResultSetHeader>(
      "DELETE FROM purchase_orders WHERE uuid = ?",
      [uuid]
    );

    if (result.affectedRows === 0) {
      console.warn(`Purchase order with ID ${uuid} not found.`);
      return false;
    }

    return true;
  } catch (error: any) {
    if (error.code && error.code === "ER_ROW_IS_REFERENCED_2") {
      console.error(`Cannot delete purchase order ${uuid} due to foreign key constraint.`);
    } else {
      console.error(`Error deleting purchase order ${uuid}:`, error);
    }
    return false;
  }
};

export const selectPurchaseOrderNames = async () => {
  try {
    const [names] = await pool.query<SelectPoNames[]>(
      "SELECT po_number AS poNumber, uuid FROM purchase_orders"
    );

    //don't safe guard as potentially no po numbers exist so simply return empty array
    return names;
  } catch (error) {
    console.error("Error fetching purchase order names:", error);
    return null;
  }
};

export const selectPurchaseOrderByUuid = async (uuid: string) => {
  try {
    const [rows] = await pool.query<SelectPoByUuid[]>(
      `SELECT 
         po.po_number AS poNumber, 
         po.order_ref AS orderRef, 
         oi.id AS itemId,
         oi.part_number AS partNumber, 
         oi.description AS description, 
         oi.quantity AS quantity, 
         oi.quantity_received AS quantityReceived, 
         oi.storage_location AS storageLocation, 
         oi.due_date AS dueDate,
         oi.threshold_overide as threshold,
         de.uuid AS deliveryId,
         de.quantity_received AS deliveryQuantityReceived,
         de.received_date AS deliveryReceivedDate
       FROM purchase_orders po
       LEFT JOIN order_items oi ON po.po_number = oi.po_number
       LEFT JOIN deliveries de ON oi.id = de.order_item_id 
       WHERE po.uuid = ?;`,
      [uuid]
    );

    if (!rows.length) return null;

    const itemsMap = new Map<
      string,
      {
        id: string;
        partNumber: string;
        description: string;
        quantity: number;
        quantityReceived: number;
        storageLocation: string | null;
        dueDate: Date;
        threshold: number;
        deliveries: {
          id: number;
          quantityReceived: number;
          dateReceived: Date;
        }[];
      }
    >();

    for (const r of rows) {
      if (!itemsMap.has(r.itemId)) {
        itemsMap.set(r.itemId, {
          id: r.itemId,
          partNumber: r.partNumber,
          description: r.description,
          quantity: r.quantity,
          quantityReceived: r.quantityReceived,
          storageLocation: r.storageLocation,
          dueDate: r.dueDate,
          threshold: r.threshold,
          deliveries: [],
        });
      }

      if (r.deliveryId !== null) {
        itemsMap.get(r.itemId)!.deliveries.push({
          id: r.deliveryId,
          quantityReceived: r.deliveryQuantityReceived!,
          dateReceived: r.deliveryReceivedDate!,
        });
      }
    }

    const items = Array.from(itemsMap.values());

    return {
      poNumber: rows[0].poNumber,
      orderRef: rows[0].orderRef,
      items,
    };
  } catch (error) {
    console.error("Error fetching purchase order details:", error);
    return null;
  }
};

export const putThreshold = async (uuid: string, state: boolean) => {
  await pool.query("UPDATE order_items SET threshold_overide = ? WHERE id = ?", [state, uuid]);
};
