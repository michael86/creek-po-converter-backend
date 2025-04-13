import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { Item, SelectPoByUuid, SelectPoNames } from "src/types/queries";

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
        de.id AS deliveryId,
        de.quantity_received AS deliveryQuantityReceived,
        de.received_date AS deliveryReceivedDate
      FROM purchase_orders po
      LEFT JOIN order_items oi ON po.po_number = oi.po_number
      LEFT JOIN deliveries de ON po.po_number = de.po_number 
        AND oi.part_number = de.part_number
      WHERE po.uuid = ?;`,
      [uuid]
    );

    if (!rows.length) return null;

    const purchaseOrder = {
      poNumber: rows[0].poNumber,
      orderRef: rows[0].orderRef,
      items: Object.values(
        rows.reduce<Record<string, Item>>((acc, row) => {
          if (!acc[row.partNumber]) {
            acc[row.partNumber] = {
              id: row.itemId,
              partNumber: row.partNumber,
              description: row.description,
              quantity: row.quantity,
              quantityReceived: row.quantityReceived,
              storageLocation: row.storageLocation,
              dueDate: row.dueDate,
              deliveries: [],
            };
          }

          if (row.deliveryQuantityReceived !== null) {
            acc[row.partNumber].deliveries.push({
              id: row.deliveryId,
              quantityReceived: row.deliveryQuantityReceived,
              dateReceived: row.deliveryReceivedDate,
            });
          }

          return acc;
        }, {})
      ),
    };

    return purchaseOrder;
  } catch (error) {
    console.error("Error fetching purchase order details:", error);
    return null;
  }
};
