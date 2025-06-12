import { NextFunction, RequestHandler, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateDeliveryInformation: RequestHandler[] = [
  body("parcels").isArray({ min: 1 }).withMessage("parcels must be a non-empty array"),
  body("parcels.*").isNumeric().withMessage("each parcel ID must be a number").toInt(),

  body("partUuid").isUUID().withMessage("partUuid must be a valid UUID"),

  body("partNumber")
    .isString()
    .withMessage("partNumber must be a string")
    .notEmpty()
    .withMessage("partNumber cannot be empty"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }
    next();
  },
];
