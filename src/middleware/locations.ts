import { RequestHandler } from "express";
import { containsSpecialExceptHyphen } from "../utils";

export const validateLocationUpdate: RequestHandler = (req, res, next) => {
  try {
    const { itemName, location }: { itemName: string; location: string } = req.body;

    if (
      typeof location !== "string" ||
      typeof itemName !== "string" ||
      containsSpecialExceptHyphen(location) ||
      containsSpecialExceptHyphen(itemName)
    ) {
      res.status(400).json({ status: 0, message: "Invalid query" });
      return;
    }
    console.log("next");
    next();
  } catch (error) {
    res.status(500).json({ status: 0, message: "Internal Server Error" });
    return;
  }
};
