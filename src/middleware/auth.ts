import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { selectUserByEmail } from "../queries/users";
import { DecodedToken, MeRequestRoute, RoleRequestRoute } from "../types/auth";

const JWT_KEY = process.env.JWT_KEY;
if (!JWT_KEY) {
  throw new Error(
    "JWT_KEY is not defined. Please set it in your environment variables."
  );
}

/**
 * 1: Admin
 * 2: Purchasing Team
 * 3: stores admin
 * 4: stores moderator
 * 5: stores editor
 * 6: stores viewer
 * 7: Production Team
 * 8: Test engineers
 */

const PROTECTED_ROUTES = {
  "locations-add": [1, 3, 4],
  "pdf-upload": [1, 2, 3, 4, 5],
  "prefix-add": [1, 3, 4],
  "purchase-orders": [1, 2, 3, 4, 5, 6],
  "manage-users": [1, 3],
  viasat: [1, 7],
};

export const validateMe: MeRequestRoute = async (req, res, next) => {
  try {
    const { authCookie } = req.cookies;

    if (!authCookie) {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized: Missing token" });
      return;
    }

    const tokenData = jwt.verify(authCookie, JWT_KEY) as DecodedToken;
    req.user = { email: tokenData.email };

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized: Invalid token" });
      return;
    }

    console.error("Unexpected Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const validateUserRole: RoleRequestRoute = async (req, res, next) => {
  try {
    const { authCookie } = req.cookies;
    const key = req.params.key.toLowerCase();

    if (!(key in PROTECTED_ROUTES)) {
      return res.status(400).json({
        status: "error",
        message: `Invalid access key: ${key}`,
      });
    }

    if (!authCookie) {
      res
        .status(401)
        .json({ status: 0, message: "Unauthorized: Missing token" });
      return;
    }

    const tokenData = jwt.verify(authCookie, JWT_KEY) as DecodedToken;
    req.user = { email: tokenData.email };

    const user = await selectUserByEmail(tokenData.email);

    const roles = PROTECTED_ROUTES[key as keyof typeof PROTECTED_ROUTES];
    if (!user?.role || roles.length <= 0 || !roles.includes(user.role)) {
      res.status(403).json({
        status: "error",
        message: "Forbidden: Insufficient permissions",
      });
      return;
    }

    next();
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      res
        .status(401)
        .json({ status: "error", message: "Unauthorized: Invalid token" });
      return;
    }

    console.error("Unexpected Error:", error);
    res.status(500).json({ status: 0, message: "Internal server error" });
  }
};
