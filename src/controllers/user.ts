import { RequestHandler } from "express";
import { registerUser } from "../queries/users";
import { RegisterUserController } from "../types/users/controllers";
import { isMySQLError } from "../utils";
import bcrypt from "bcrypt";

export const handleLogin: RequestHandler = async (req, res) => {
  try {
    res.status(200).json({ status: "success", message: "user logged in" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "internal server error" });
  }
};

export const handleRegister: RegisterUserController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRegistered = await registerUser(email, hashedPassword, name);

    if (!userRegistered) throw new Error("User not registered");

    res.status(200).json({ status: "success", message: "user registered" });
  } catch (error) {
    if (isMySQLError(error)) {
      if (error.code === "ER_DUP_ENTRY") {
        res.status(409).json({ status: "error", message: "user already exists" });
        return;
      }
      res.status(400).json({ status: "error", message: error.message });
      return;
    }

    res.status(500).json({ status: "error", message: "internal server error" });
  }
};
