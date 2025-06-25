// src/middleware/auditLogger.ts
import { Request, Response, NextFunction } from "express";
import { logUserAction } from "../utils/logUserAction";

export const auditLogger = (
  action: string,
  getContext?: (req: Request, res: Response) => string
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user?.id) return next();

    const userId = req.user.id;

    // Defer logging until response is complete
    res.on("finish", () => {
      // Only log successful requests (status 200–299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const context = getContext?.(req, res);
        logUserAction(userId, action, context);
      }
    });

    next();
  };
};
