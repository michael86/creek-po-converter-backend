import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { SelectPoByUuid, SelectPoNames } from "src/types/queries";

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
          oi.part_number AS partNumber, 
          oi.description AS description, 
          oi.quantity AS quantity, 
          oi.quantity_received AS quantityReceived, 
          oi.storage_location AS storageLocation, 
          oi.due_date AS dueDate
       FROM purchase_orders po
       LEFT JOIN order_items oi ON po.po_number = oi.po_number
       WHERE po.uuid = ?`,
      [uuid]
    );

    if (!rows.length) return null; // ✅ Return null if PO doesn't exist

    // ✅ Group the items under a single PO object
    const purchaseOrder = {
      poNumber: rows[0].poNumber,
      orderRef: rows[0].orderRef,
      items: rows
        .filter((row) => row.partNumber) // Remove rows where there's no item
        .map((row) => ({
          partNumber: row.partNumber,
          description: row.description,
          quantity: row.quantity,
          quantityReceived: row.quantityReceived,
          storageLocation: row.storageLocation,
          dueDate: row.dueDate,
        })),
    };

    return purchaseOrder;
  } catch (error) {
    console.error("Error fetching purchase order details:", error);
    return null;
  }
};
