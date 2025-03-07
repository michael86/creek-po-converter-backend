import { ResultSetHeader } from "mysql2";
import pool from "../db/config";

export const insertPurchaseOrder = async (purchaseOrder: string, orderRef: string) => {
  try {
    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO purchase_orders (po_number, order_ref) VALUES (?, ?)`,
      [purchaseOrder, orderRef]
    );

    if (!res.insertId) throw new Error("Error inserting purchase order");

    return res.insertId;
  } catch (error) {
    console.error("Database Insert Error:", error);
    return null;
  }
};
