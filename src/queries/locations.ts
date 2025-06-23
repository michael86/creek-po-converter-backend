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
    if (!res.affectedRows) throw new Error(`Error setting location for ${partNumber}`);

    return res.affectedRows;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setPartLocationById = async (partId: number, location: string) => {
  try {
    console.log(
      "Query: ",
      `UPDATE order_items SET storage_location = ${location} WHERE id = ${partId}`
    );

    const [res] = await pool.execute<ResultSetHeader>(
      "UPDATE order_items SET storage_location = ? WHERE id = ?",
      [location, partId]
    );

    if (!res.affectedRows)
      throw new Error(`Error setting location for ${partId}\nStack Trace: ${JSON.stringify(res)}`);

    return res.affectedRows;
  } catch (error) {
    if (error instanceof Error && "code" in error) {
      return error.code as string;
    }
    console.error("Database Insert Error:", error);
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

export const insertLocation = async (location: string, amount: number) => {
  const params: string[] = [];

  if (amount > 0) {
    for (let i = 1; i <= amount; i++) {
      console.log(i, " ", amount);
      params.push(`${location}-${i}`);
    }
  } else {
    params.push(location);
  }

  const query = "INSERT INTO locations (name) VALUES " + params.map(() => "(?)").join(", ");

  pool.query(query, params);
};
