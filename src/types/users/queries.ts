import { RowDataPacket } from "mysql2";

export type RegisterUser = (
  email: string,
  password: string,
  name: string
) => Promise<number | void>;

export interface GetUsers extends RowDataPacket {
  id: number;
  email: string;
  name: string;
  registered: Date;
}
