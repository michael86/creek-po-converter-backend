import { PutRequest } from "@types_sql/index";
import { SelectLogs } from "@types_sql/queries";
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

export const selectLogs = async () => {
  try {
    const logs = await runQuery<SelectLogs>(
      `SELECT user, log, UNIX_TIMESTAMP(date_created) AS dateCreated FROM logs`,
      []
    );
    if ("code" in logs) throw new Error(`Failed to select all logs`);

    return [...logs];
  } catch (error) {
    console.error(error);
    return;
  }
};
