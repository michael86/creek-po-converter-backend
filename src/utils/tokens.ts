import jwt from "jsonwebtoken";

type Payload = Record<string, any>;

export const generateToken = (payload: Payload) =>
  jwt.sign(payload, process.env.JWT_KEY!, { expiresIn: 60 * 60 * 6 });
