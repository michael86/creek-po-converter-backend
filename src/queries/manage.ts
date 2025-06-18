import { GetUsers } from "../types/users/queries";
import pool from "../db/config";

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
