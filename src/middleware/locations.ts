import { NextFunction, RequestHandler, Request, Response } from "express";
import { containsSpecialExceptHyphen } from "../utils";
import { body, validationResult } from "express-validator";

export const validateLocationUpdate: RequestHandler = (req, res, next) => {
  console.log("validateLocationUpdate called");
  try {
    const { itemName, location }: { itemName: string; location: string } = req.body;

    if (
      typeof location !== "string" ||
      typeof itemName !== "string" ||
      containsSpecialExceptHyphen(location) ||
      containsSpecialExceptHyphen(itemName)
    ) {
      res.status(400).json({ status: 0, message: "Invalid query" });
      return;
    }
    console.log("next");
    next();
  } catch (error) {
    res.status(500).json({ status: 0, message: "Internal Server Error" });
    return;
  }
};

export const validateAddLocation = [
  body("location").trim().notEmpty().withMessage("Location can't be empty"),
  body("amount").isNumeric().withMessage("Amount must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: 0,
        message: "Invalid query",
        errors: errors.array(), // More readable format
      });
    }
    next();
  },
];
