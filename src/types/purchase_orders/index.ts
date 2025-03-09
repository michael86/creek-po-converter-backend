import { Request } from "express";

export interface UpdateLocationRequest extends Request {
  body: {
    location: string;
  };
}
