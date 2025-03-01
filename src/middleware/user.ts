import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

const userBodies: Record<string, ValidationChain[]> = {
  login: [
    body("email")
      .notEmpty()
      .trim()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Invalid email format"),
    body("password").trim().notEmpty().withMessage("Password is required"),
  ],
};

userBodies.register = [
  ...userBodies.login,
  body("name").trim().notEmpty().withMessage("Name is required"),
];

// Middleware to validate request body fields
export const validateUser = (route: "login" | "register") => [
  ...userBodies[route],
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    console.log(errors);
    console.log(req.body);
    if (!errors.isEmpty()) {
      res.status(400).json({ status: "error", errors: errors.array() });
      return;
    }
    next();
  },
];
