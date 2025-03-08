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

export interface Prefix extends RowDataPacket {
  prefix: string;
}

//number is success, string is sql error, null is server error 500
export type InsertPurchaseOrder = (
  purchaseOrder: string,
  orderRef: string
) => Promise<true | string | null>;

export interface SelectPoNames extends RowDataPacket {
  poNumber: string;
}

export interface SelectPoByUuid extends RowDataPacket {
  poNumber: string;
  orderRef: string;
  partNumber: string;
  description: string;
  quantity: string;
  quantityReceived: string;
  storageLocation: string;
  dueDate: string;
}
