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

export type Delivery = {
  id: number;
  quantityReceived: number;
  dateReceived: Date | null;
};

export type Item = {
  id: number;
  partNumber: string;
  description: string;
  quantity: number;
  quantityReceived: number;
  storageLocation: string | null;
  dueDate: Date;
  deliveries: Delivery[];
};

export interface SelectPoByUuid extends RowDataPacket {
  poNumber: string;
  orderRef: string;
  itemId: string;
  partNumber: string;
  description: string;
  quantity: number;
  quantityReceived: number;
  storageLocation: string | null;
  threshold: number;
  dueDate: Date;
  deliveryQuantityReceived: number | null;
  deliveryReceivedDate: Date;
}

export interface SelectLocationId extends RowDataPacket {
  id: number;
}

export interface SelectLocations extends RowDataPacket {
  name: string;
  id: number;
}

//number is success, string is sql error, null is server error 500
export type InsertDeliveries = (
  poNumber: string,
  deliveries: number[],
  uuid: string,
  partNumber: string,
  date: Date
) => Promise<DeliveryRow[] | string | null>;

export interface DeliveryRow extends RowDataPacket {
  id: string;
  dateReceived: string;
  quantityReceived: number;
}
