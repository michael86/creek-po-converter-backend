import { MysqlError } from "mysql";

export type SqlQueryVars = (string | number)[] | string | number;

export type FecthRequest = { [key: string]: string }[];

export type PutRequest = {
  fieldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol41: boolean;
  changedRows: number;
};

export type AsyncMySql = <T>(query: string, vars: SqlQueryVars) => Promise<MysqlError | T>;

export type GetUserRole = (email: string) => Promise<number | void>;
