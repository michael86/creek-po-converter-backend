import { generateToken, setJwtCookie } from "../utils/tokens";
import { registerUser, selectUserByEmail } from "../queries/users";
import { LoginUserController, RegisterUserController } from "../types/users/controllers";
import { isMySQLError } from "../utils";

import bcrypt from "bcrypt";

export const handleLogin: LoginUserController = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await selectUserByEmail(email);

    if (!user) {
      res.status(404).json({ status: "error", message: "Invalid email or password" });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ status: "error", message: "Invalid email or password" });
      return;
    }

    const jwtToken = await generateToken({ email: user.email });
    setJwtCookie(res, jwtToken);

    console.log(user);

    res.status(200).json({
      status: "success",
      message: "User logged in",
      data: { email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    if (isMySQLError(error)) {
      console.error("MySQL Error:", error);
      res.status(500).json({ status: "error", message: "Database error" });
      return;
    }

    console.error("Internal Server Error:", error);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};

export const handleRegister: RegisterUserController = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRegistered = await registerUser(email, hashedPassword, name);

    if (!userRegistered) throw new Error("User not registered");

    const jwtToken = await generateToken({ email });
    setJwtCookie(res, jwtToken);

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
