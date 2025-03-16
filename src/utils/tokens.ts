import jwt from "jsonwebtoken";
import { Response } from "express";

type Payload = Record<string, any>;

const isProduction = process.env.NODE_ENV === "production";
console.log(isProduction);
export const generateToken = (payload: Payload) =>
  jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: 60 * 60 * 6 });

export const setJwtCookie = (res: Response, token: string) => {
  res.cookie("authCookie", token, {
    maxAge: 1000 * 60 * 60 * 6, // 6 hours
    httpOnly: true,
    secure: isProduction, // False in development (localhost is HTTP)
    sameSite: isProduction ? "none" : "lax", // "lax" allows cross-site on HTTP localhost
    path: "/",
  });
};
