import jwt from "jsonwebtoken";
import { Response } from "express";

type Payload = Record<string, any>;

export const generateToken = (payload: Payload) =>
  jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: 60 * 60 * 6 });

export const setJwtCookie = (res: Response, token: string) => {
  res.cookie("authCookie", token, {
    maxAge: 1000 * 60 * 60 * 6, // 6 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
};
