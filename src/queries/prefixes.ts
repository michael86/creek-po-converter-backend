import { Prefix } from "../types/queries";
import pool from "../db/config";

export const selectPrefixes = async () => {
  try {
    const [prefixes] = await pool.query<Prefix[]>(
      "SELECT prefix FROM prefixes"
    );
    return prefixes;
  } catch (error) {
    console.error("error selecting all prefixes\n", error);
    return null;
  }
};

export const insertPrefix = async (prefix: string) => {
  await pool.query("INSERT INTO prefixes (prefix) VALUES (?)", [prefix]);
};
