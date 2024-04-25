import { getUserRole } from "../db/queries/user";
import { Request, Response, NextFunction } from "express";

export const checkUserRoleForAction = (action: number) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const { email } = req.headers;
    if (!email) return res.status(400).send();

    const userRole = await getUserRole(email as string);
    if (!userRole) return res.status(500).send();

    if (userRole >= action) {
      next();
      return;
    }

    res.status(500).send;
  };
};
