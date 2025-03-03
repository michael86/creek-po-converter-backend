import { RowDataPacket } from "mysql2";

export interface MySQLError extends Error {
  code?: string;
  errno?: number;
  sqlState?: string;
  sqlMessage?: string;
}

export interface SelectUserByEmail extends RowDataPacket {
  email: string;
  password: string;
  name: string;
  role: number;
}
