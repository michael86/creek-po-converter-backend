import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { DecodedToken, MeRequestRoute } from "src/types/auth";

const JWT_KEY = process.env.JWT_KEY;
if (!JWT_KEY) {
  throw new Error("JWT_KEY is not defined. Please set it in your environment variables.");
}

export const validateMe: MeRequestRoute = async (req, res, next) => {
  try {
    console.log("validating me");
    const { authCookie } = req.cookies;

    if (!authCookie) {
      res.status(401).json({ status: "error", message: "Unauthorized: Missing token" });
      return;
    }

    const tokenData = jwt.verify(authCookie, JWT_KEY) as DecodedToken;
    req.user = { email: tokenData.email };

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res.status(401).json({ status: "error", message: "Unauthorized: Invalid token" });
      return;
    }

    console.error("Unexpected Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
