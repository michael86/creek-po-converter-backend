import { isMySQLError } from "../utils";
import { InsertDeliveries } from "../types/queries";
import pool from "../db/config";
import { ResultSetHeader } from "mysql2";

export const insertDeliveries: InsertDeliveries = async (
  poNumber,
  deliveries,
  uuid,
  partNumber,
  date
) => {
  try {
    const values = deliveries.map((value) => [poNumber, partNumber, value, date, uuid]);

    const [res] = await pool.query<ResultSetHeader>(
      "INSERT INTO deliveries (po_number, part_number, quantity_received, received_date, order_item_id) VALUES ?",
      [values]
    );

    if (!res.affectedRows) throw new Error(`Error inserting deliveries`);

    return true;
  } catch (error) {
    if (isMySQLError(error)) {
      console.error(error.code);
      console.error(error.message);
      return error.message;
    }

    return null;
  }
};
