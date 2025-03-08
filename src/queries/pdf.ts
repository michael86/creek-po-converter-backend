import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { Part } from "../types/pdf";
import { InsertPurchaseOrder } from "src/types/queries";

export const insertPurchaseOrder: InsertPurchaseOrder = async (purchaseOrder, orderRef) => {
  try {
    const [res] = await pool.execute<ResultSetHeader>(
      `INSERT INTO purchase_orders (po_number, order_ref, uuid) VALUES (?, ?, uuid())`,
      [purchaseOrder, orderRef]
    );

    if (!res.affectedRows) throw new Error(`Error inserting purchase order`);

    return true;
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      return error.code as string;
    }
    console.error("Database Insert Error:", error);
    return null;
  }
};

export const insertOrderItems = async (poNumber: string, items: Part[]) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const sql = `
      INSERT INTO order_items (po_number, part_number, description, quantity, due_date) 
      VALUES (?, ?, ?, ?, ?)
    `;

    for (const item of items) {
      await connection.execute<ResultSetHeader>(sql, [
        poNumber,
        item.partNumber,
        item.description,
        item.quantity,
        item.dueDate,
      ]);
    }

    await connection.commit();
    connection.release();
    return true;
  } catch (error) {
    await connection.rollback();
    connection.release();

    console.error("Error inserting order items:", error);
    return false;
  }
};
