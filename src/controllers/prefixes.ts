import { RequestHandler } from "express";

export const addPrefix: RequestHandler = (req, res) => {
  try {
    res.status(200).json({ status: 1, message: "Prefix added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "Internal Server Error" });
  }
};
