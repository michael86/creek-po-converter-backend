import { Request, Response } from "express";

interface UserRequest extends Request {
  body: {
    email: string;
    password: string;
    name: string;
  };
}

export type RegisterUserController = (req: UserRequest, res: Response) => Promise<void>;
export type LoginUserController = (req: UserRequest, res: Response) => Promise<void>;
