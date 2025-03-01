import dotenv from "dotenv";
dotenv.config(); //load env variabls first

import cors from "cors";
import pool from "./db/config";
import express from "express";
import userRoutes from "./routes/user";
import authRoutes from "./routes/auth";
import cookieparser from "cookie-parser";

const app = express();
const PORT = process.env.API_PORT || 3000;

pool
  .getConnection()
  .then(async (conn) => {
    console.log("Database connected successfully!");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    process.exit(1);
  });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieparser());
app.use(express.json());

app.use("/user", userRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log("App started, listening on port ", PORT);
});
