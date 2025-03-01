import { Request, Response, NextFunction } from "express";

interface MeRequest extends Request {
  user?: {
    email: string;
  };
}

export type DecodedToken = {
  email: string;
  iat: number;
  exp: number;
};

export type MeRequestRoute = (req: MeRequest, res: Response, next: NextFunction) => Promise<void>;
