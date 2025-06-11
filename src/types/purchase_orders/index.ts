import { Request } from "express";

export interface UpdateLocationRequest extends Request {
  body: {
    location: string;
  };
}

export type Deliveries = {
  id: number;
  quantityReceived: number;
  dateReceived: Date;
}[];
