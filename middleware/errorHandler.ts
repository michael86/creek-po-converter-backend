// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error("An error occurred:", err);
  res.status(500).json({ error: "Internal Server Error" });
}
