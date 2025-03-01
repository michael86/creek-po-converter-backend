import { RequestHandler } from "express";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    res.status(200).json({ status: "success", message: "user logged in" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "internal server error" });
  }
};

export const handleRegister: RequestHandler = async (req, res) => {
  try {
    console.log("Register user");
    res.status(200).json({ status: "success", message: "user registered" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "internal server error" });
  }
};
