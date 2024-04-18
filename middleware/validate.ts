import express from "express";
import { body, validationResult, ContextRunner } from "express-validator";
// can be reused by many routes

// sequential processing, stops running validations chain if the previous one fails.
export const validate = (validations: ContextRunner[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    console.log("errors");
    if (errors.isEmpty()) {
      return next();
    }
    console.log("after errors");

    res.status(400).json({ errors: errors.array() });
  };
};
