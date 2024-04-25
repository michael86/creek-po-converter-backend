import { PutRequest } from "@types_sql/index";
import { runQuery } from "../connection";

export const insertNewLog = async (userId: number, email: string, message: string) => {
  try {
    const logId = await runQuery<PutRequest>(`INSERT INTO logs (log, user) VALUES (?, ?)`, [
      message,
      email,
    ]);
    if ("code" in logId)
      throw new Error(`Failed to insert new log \nEmail: ${email} \nMessage: ${message}`);

    const relation = await runQuery<PutRequest>(
      `INSERT INTO user_log (user, action) VALUES (?,?)`,
      [userId, logId.insertId]
    );
    if ("code" in relation)
      throw new Error(`Failed to create new log relation ${relation.message}`);

    return relation.insertId;
  } catch (error) {
    console.error(error);
    return;
  }
};
