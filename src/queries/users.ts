import { ResultSetHeader } from "mysql2";
import pool from "../db/config";
import { RegisterUser } from "../types/users/queries";

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
