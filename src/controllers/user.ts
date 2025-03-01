import { RequestHandler } from "express";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    res.status(200).json({ status: "success", message: "user logged in" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "internal server error" });
  }
};
