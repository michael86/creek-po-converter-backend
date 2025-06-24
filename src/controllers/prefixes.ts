import { RequestHandler } from "express";
import { insertPrefix } from "../queries/prefixes";

export const addPrefix: RequestHandler = async (req, res) => {
  try {
    const { prefix } = req.body;
    await insertPrefix(prefix);

    res.status(200).json({ status: 1, message: "Prefix added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 0, message: "Internal Server Error" });
  }
};
