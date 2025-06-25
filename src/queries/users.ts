import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { RegisterUser } from "../types/users/queries";
import { SelectUserByEmail } from "src/types/queries";

export const registerUser: RegisterUser = async (email, password, name) => {
  try {
    const [res] = await pool.execute<ResultSetHeader>(
      "INSERT INTO users (email, password, name) VALUES (?,?,?)",
      [email, password, name]
    );

    return res.insertId;
  } catch (err) {
    throw err;
  }
};

export const selectUserByEmail = async (email: string) => {
  try {
    const [user] = await pool.execute<SelectUserByEmail[]>(
      "SELECT id, email, password, role_id as role, name FROM users WHERE email = ?",
      [email]
    );

    if (user.length === 0) {
      return;
    }

    return user[0];
  } catch (error) {
    console.error(error);
    throw error;
  }
};
