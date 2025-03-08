import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { SelectPoNames } from "src/types/queries";

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
