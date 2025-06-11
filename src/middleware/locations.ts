import { RequestHandler } from "express";
import { containsSpecialExceptHyphen } from "../utils";

export const validateLocationUpdate: RequestHandler = (req, res, next) => {
  try {
    const { itemId, location }: { itemId: number; location: string } = req.body;
    if (
      typeof itemId !== "number" ||
      isNaN(itemId) ||
      typeof location !== "string" ||
      containsSpecialExceptHyphen(location)
    ) {
      res.status(400).json({ status: 0, message: "Invalid query" });
      return;
    }

    next();
  } catch (error) {
    res.status(500).json({ status: 0, message: "Internal Server Error" });
    return;
  }
};
