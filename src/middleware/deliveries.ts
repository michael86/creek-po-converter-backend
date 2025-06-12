import { NextFunction, RequestHandler, Request, Response } from "express";
import { body, validationResult } from "express-validator";

export const validateDeliveryInformation: RequestHandler[] = [
  body("poNumber")
    .isString()
    .withMessage("po number must be a string")
    .notEmpty()
    .withMessage("Po Number can't be empty"),

  body("deliveries")
    .isArray({ min: 1 })
    .withMessage("parcels deliveries must be a non-empty array"),
  body("deliveries.*").isNumeric().withMessage("each deliveries ID must be a number").toInt(),

  body("uuid").isUUID().withMessage("uuid must be a valid UUID"),
  body("date")
    .isISO8601()
    .toDate()
    .withMessage("Date must be a valid date")
    .notEmpty()
    .withMessage("Date can not be empty"),

  body("partNumber")
    .isString()
    .withMessage("partNumber must be a string")
    .notEmpty()
    .withMessage("partNumber cannot be empty"),

  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      console.warn("Error submitting deliveries\n", errors);
      return;
    }
    next();
  },
];
