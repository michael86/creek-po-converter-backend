import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const updateUserRoleValidation = [
  body("role").trim().isNumeric().notEmpty().withMessage("Role is required and must be a number"),
  param("id").trim().isNumeric().withMessage("User ID must be a number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }
    next();
  },
];
