import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validateAddPrefix = [
  body("prefix").trim().notEmpty().withMessage("prefix can't be empty"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        status: 0,
        message: "Invalid query",
        errors: errors.array(),
      });
      return;
    }
    next();
  },
];
