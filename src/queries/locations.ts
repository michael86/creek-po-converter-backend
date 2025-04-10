import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { SelectLocationId, SelectLocations } from "../types/queries";

export const selectLocationIdByName = async (name: string) => {
  const [[id]] = await pool.execute<SelectLocationId[]>(
    "SELECT id FROM locations WHERE name = ? ",
    [name.toUpperCase()]
  );

  return id;
};

export const setPartLocation = async (partNumber: string, location: string) => {
  try {
    const [res] = await pool.execute<ResultSetHeader>(
      "UPDATE order_items SET storage_location = ? WHERE part_number = ?",
      [location, partNumber]
    );
    if (!res.affectedRows) return null;

    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const selectAllLocations = async () => {
  try {
    const [res] = await pool.execute<SelectLocations[]>(`
      SELECT name, id 
        FROM locations ORDER BY 
          LEFT(name, POSITION('-' IN name) - 1),
            CAST(SUBSTRING(name FROM POSITION('-' IN name) + 1) AS INTEGER);`);

    return res;
  } catch (error) {
    console.error(error);
    return null;
  }
};
