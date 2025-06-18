import { GetUsers } from "../types/users/queries";
import pool from "../db/config";
import { ResultSetHeader } from "mysql2";

export const selectUsers = async () => {
  try {
    const [users] = await pool.query<GetUsers[]>(
      "SELECT id, email, name, role, date_created as dateCreated FROM users"
    );
    return users;
  } catch (error) {
    console.error("error selecting all prefixes\n", error);
    return null;
  }
};

export const updateUserRole = async (id: number, role: number) => {
  const [result] = await pool.query<ResultSetHeader>("UPDATE users SET role = ? WHERE id = ?", [
    role,
    id,
  ]);

  return result;
};
