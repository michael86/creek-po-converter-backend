import { RequestHandler } from "express";
import { generateToken } from "../utils/tokens";
import { validateUserToken, updateUserToken } from "../db/queries/user";
import { UserHeaders } from "@types_sql/index";

export const validateToken: RequestHandler = async (req, res, next) => {
  if (shouldSkipValidation(req.path) || req.path.includes("validate-token")) {
    next();
    return;
  }

  try {
    const { email, token } = req.headers as UserHeaders;

    if (!email || !token) {
      res.status(400).send({ error: "Email or token missing" });
      return;
    }

    const valid = await validateUserToken(email, token);

    if (!valid) {
      console.error("Token validation failed: Invalid token or email");
      res.status(400).send({ error: "Token validation failed" });
      return;
    }

    const newToken = generateToken();
    const updated = await updateUserToken(email, newToken);

    if (!updated) {
      console.error("Failed to update user token in middleware");
      res.status(500).send({ error: "Failed to update user token" });
      return;
    }

    req.headers.newToken = newToken;
    next();
  } catch (error) {
    console.error("Token validation error:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};

function shouldSkipValidation(path: string): boolean {
  const skipPaths = ["/login", "/register"];
  return skipPaths.includes(path);
}
