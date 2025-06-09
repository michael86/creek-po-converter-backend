import { body, param } from "express-validator";

export const ORDER_UPDATE = [
  body("lineId").trim().isNumeric(),
  body("description").optional().trim(),
  body("count").optional().trim().isNumeric(),
  body("dateDue").optional().trim(),
];

export const ORDER_DELETE = [body("lineId").exists().trim().isNumeric()];

export const ORDER_ADD_PARCEL = [
  body("parcels.*").exists().trim().isNumeric(),
  body("index").exists().trim().isNumeric(),
];

export const ORDER_SET_PARTIAL = [param("index").exists().trim().isNumeric()];
