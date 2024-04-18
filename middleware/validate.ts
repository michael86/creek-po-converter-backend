import { RequestHandler } from "express";
import { query } from "express-validator";

export const validateQuery: RequestHandler = (req, res, next) => {
  const params = Object.keys(req.params);

  for (const param of params) {
    const valid = query().notEmpty();
  }

  next();
};
